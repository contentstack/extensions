import { FontDefinition } from "./types";

/**
 * Loads webfonts into the JSON RTE's iframe document.
 *
 * Every plugin configured on a field is loaded into the same rte-extension
 * iframe, so that document is shared with the editor chrome and with every
 * other Marketplace plugin. Fonts are therefore registered through the CSS Font
 * Loading API rather than by appending the configured URL as a stylesheet:
 * adding a FontFace can only introduce a font family, whereas injecting a
 * config-supplied stylesheet would put arbitrary third-party CSS into a
 * document it has no business restyling.
 *
 * A font file referenced from `@font-face` needs CORS either way, so this costs
 * nothing in reach compared with a <link>.
 */

/**
 * Families the iframe already provides for its own chrome. A configured font
 * may not shadow these — redefining them would restyle the editor itself, for
 * every plugin in the document.
 */
const HOST_PROVIDED = ["inter", "ibm plex mono"];

/** Hosts whose stylesheets are known to contain nothing but @font-face rules. */
const STYLESHEET_FALLBACK_HOSTS = ["fonts.googleapis.com"];

const FONT_FILE = /\.(woff2?|ttf|otf)(\?|#|$)/i;

/** family::url pairs already registered, so a re-render does not re-register. */
const loaded: { [key: string]: boolean } = {};

interface ParsedFace {
    /** The declared `font-family`, empty when the block omits one. */
    family: string;
    /** The full `src` descriptor, including any `format(...)`. */
    src: string;
    descriptors: { [key: string]: string };
}

const isHostProvided = (family: string) =>
    HOST_PROVIDED.indexOf(family.trim().toLowerCase()) !== -1;

const unquote = (value: string) => value.trim().replace(/^['"]|['"]$/g, "");

/**
 * Loads the fonts a user added on the app's configuration screen.
 *
 * The family name is taken from the configuration, not from the stylesheet,
 * because that name is what the plugin writes into the entry JSON and what the
 * delivered page will ask for.
 */
export const loadConfiguredFonts = (fonts: FontDefinition[]) =>
    Promise.all(fonts.map(loadConfiguredFont)).then(() => undefined);

const loadConfiguredFont = async ({ name, url }: FontDefinition) => {
    const family = (name || "").trim();
    if (!family || !url) return;

    if (isHostProvided(family)) {
        console.warn(
            `[font-app] ignoring configured font "${family}": that family is used by the editor itself.`
        );
        return;
    }

    const key = `${family}::${url}`;
    if (loaded[key]) return;
    loaded[key] = true;

    try {
        if (FONT_FILE.test(url)) {
            addFace(family, { family, src: `url(${url})`, descriptors: {} });
            return;
        }

        const faces = await parseStylesheet(url);
        if (!faces.length) {
            throw new Error("stylesheet declared no @font-face rules");
        }

        // Prefer the blocks that actually declare this family. A self-hosted
        // sheet may name it something else, in which case every block is
        // registered under the configured name — that is what the user asked
        // for by typing it.
        const matching = faces.filter(
            (face) => face.family.toLowerCase() === family.toLowerCase()
        );
        if (!matching.length) {
            console.warn(
                `[font-app] "${family}" is not declared in ${url}; registering its @font-face rules under that name anyway.`
            );
        }

        (matching.length ? matching : faces).forEach((face) => addFace(family, face));
    } catch (err) {
        loaded[key] = false;
        console.error(`[font-app] could not load font "${family}" from ${url}`, err);
        appendStylesheetFallback(url);
    }
};

/**
 * Loads a stylesheet that declares several families, registering each block
 * under the name it declares. Used for the app's own bundled font list.
 */
export const loadBundledStylesheet = async (url: string) => {
    if (loaded[url]) return;
    loaded[url] = true;

    try {
        const faces = await parseStylesheet(url);
        faces
            .filter((face) => face.family && !isHostProvided(face.family))
            .forEach((face) => addFace(face.family, face));
    } catch (err) {
        loaded[url] = false;
        console.error(`[font-app] could not load bundled fonts from ${url}`, err);
        appendStylesheetFallback(url);
    }
};

/**
 * Registers one face. Deliberately does not call `face.load()`: adding the face
 * is enough for it to take part in font matching, and the browser then fetches
 * only the subsets the text on screen actually needs — exactly as it would for
 * an @font-face rule in a stylesheet. Forcing the load would pull down all ~180
 * subset files of the bundled list on every editor mount.
 */
const addFace = (family: string, { src, descriptors }: ParsedFace) => {
    const FontFaceCtor = (window as any).FontFace;
    const fontSet = (document as any).fonts;
    if (!FontFaceCtor || !fontSet) return;

    fontSet.add(new FontFaceCtor(family, src, { display: "swap", ...descriptors }));
};

/** FontFace descriptor name -> the CSS descriptor it comes from. */
const DESCRIPTORS: Array<[string, string]> = [
    ["style", "font-style"],
    ["weight", "font-weight"],
    ["stretch", "font-stretch"],
    ["unicodeRange", "unicode-range"],
];

/**
 * Extracts the @font-face rules from a stylesheet, and nothing else.
 *
 * Descriptors are carried across so that Google Fonts' per-subset
 * `unicode-range` splits survive: collapsing them into one face would serve the
 * latin subset for every codepoint and render non-latin text with the wrong
 * glyphs.
 */
const parseStylesheet = async (url: string): Promise<ParsedFace[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    const css = await response.text();

    const blocks = css.match(/@font-face\s*\{[^}]*\}/gi) || [];
    const faces: ParsedFace[] = [];

    blocks.forEach((block) => {
        const src = readDescriptor(block, "src");
        if (!src) return;

        const descriptors: { [key: string]: string } = {};
        DESCRIPTORS.forEach(([key, property]) => {
            const value = readDescriptor(block, property);
            if (value) descriptors[key] = value;
        });

        faces.push({
            family: unquote(readDescriptor(block, "font-family")),
            src,
            descriptors,
        });
    });

    return faces;
};

const readDescriptor = (block: string, property: string) => {
    const match = new RegExp(
        `(?:^|;|\\{)\\s*${property}\\s*:\\s*([^;}]+)`,
        "i"
    ).exec(block);
    return match ? match[1].trim() : "";
};

/**
 * Last resort for a Content-Security-Policy that allows the stylesheet but not
 * the `fetch` behind it. Limited to hosts whose responses are known to be
 * @font-face-only, so this never puts an arbitrary third party's CSS into the
 * shared document.
 */
const appendStylesheetFallback = (url: string) => {
    let host = "";
    try {
        host = new URL(url, window.location.href).host;
    } catch (err) {
        return;
    }
    if (STYLESHEET_FALLBACK_HOSTS.indexOf(host) === -1) return;

    const existing = document.querySelector(`link[data-font-app="${url}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-font-app", url);
    document.head.appendChild(link);
};
