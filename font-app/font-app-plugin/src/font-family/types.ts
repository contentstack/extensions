import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";

/** A font added through the app's Marketplace configuration screen. */
export interface FontDefinition {
    name: string;
    /** A stylesheet (e.g. a Google Fonts css2 URL) or a font file. */
    url: string;
}

/**
 * The app configuration as returned by `rte.getConfig()`.
 *
 * `fontFamily` is what the current config screen writes. `font_family.font` is
 * the shape earlier installs were saved under. Both are read so an existing
 * install keeps working without a data migration.
 */
export interface FontAppConfig {
    fontFamily?: FontDefinition[];
    font_family?: {
        font?: FontDefinition[];
    };
}

/**
 * `rte.getConfig()` is provided by the editor at runtime but is missing from
 * some published versions of the app-sdk types, so it is declared here.
 *
 * It resolves to a Promise whenever the plugin runs as an installed Marketplace
 * app, and to the plain config object otherwise — always await it.
 */
export type RteWithConfig = IRteParam & {
    getConfig?: () => FontAppConfig | Promise<FontAppConfig>;
};
