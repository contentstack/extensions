import React, { useEffect, useState } from "react";
import { Dropdown } from "@contentstack/venus-components";

import FONTS, { BUNDLED_FONTS_STYLESHEET } from "./font";
import { FontAppConfig, FontDefinition, RteWithConfig } from "./types";
import { loadBundledStylesheet, loadConfiguredFonts } from "./fontLoader";
import { addMark } from "../rteRef";

// component to be rendered
export const FontComponent = (props: any) => {
    const { leaf, children, attrs, attributes } = props;
    return (
        <span
            {...attrs}
            {...attributes}
            style={{ fontFamily: leaf["font-family"] }}
        >
            {children}
        </span>
    );
};

/**
 * Reads the configured fonts out of the app configuration.
 *
 * `fontFamily` is what the current configuration screen writes;
 * `font_family.font` is the shape earlier installs were saved under.
 */
export const readConfiguredFonts = (
    config: FontAppConfig | null | undefined
): FontDefinition[] => {
    const fonts = config?.fontFamily || config?.font_family?.font || [];
    return Array.isArray(fonts)
        ? fonts.filter((font) => font && font.name && font.url)
        : [];
};

/**
 * Reads the app configuration. Called fresh each time the dropdown mounts,
 * so config changes (adding fonts) are picked up immediately.
 *
 * `rte.getConfig()` returns a Promise whenever the plugin is running as an
 * installed Marketplace app, and the plain config object otherwise, so it is
 * always awaited. Reading it synchronously is what previously left the
 * configured list empty.
 */
const getAppConfig = (rte: RteWithConfig): Promise<FontAppConfig | null> => {
    if (!rte || typeof rte.getConfig !== "function") return Promise.resolve(null);

    return Promise.resolve(rte.getConfig())
        .then((config) => (config || null) as FontAppConfig | null)
        .catch((err) => {
            console.error("[font-app] could not read the app configuration", err);
            return null;
        });
};

/**
 * Resolves the configured fonts and makes sure everything offered in the
 * dropdown has a webfont loaded in this iframe.
 */
const useFontOptions = (rte: RteWithConfig) => {
    const [configuredFonts, setConfiguredFonts] = useState<FontDefinition[]>([]);

    useEffect(() => {
        let active = true;

        loadBundledStylesheet(BUNDLED_FONTS_STYLESHEET);

        getAppConfig(rte).then((config) => {
            const fonts = readConfiguredFonts(config);
            if (active) setConfiguredFonts(fonts);
            return loadConfiguredFonts(fonts);
        });

        return () => {
            active = false;
        };
    }, [rte]);

    const names = configuredFonts.map((font) => font.name);
    return names.concat(FONTS.filter((font) => names.indexOf(font) === -1));
};

// Dropdown items
const list = (fonts: string[]) =>
    fonts.map((font) => {
        return {
            label: (
                <span
                    style={{ fontFamily: font }}
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    {font}
                </span>
            ),
            value: font,
            showActive: true,
            action: () => {
                addMark("font-family", font);
            },
            highlightActive: true,
        };
    });

const FontFamilyIcon = () => {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.49974 12L3.56654 9.04102H8.42714L9.50026 12H12L7.4424 0H4.55129L0 12H2.49974ZM4.19779 7.29492L5.94634 2.46094H6.04734L7.7959 7.29492H4.19779Z"
                fill="#647696"
            />
        </svg>
    );
};

export function FMIcon({ rte }: { rte: RteWithConfig }) {
    const fonts = useFontOptions(rte);

    return (
        <Dropdown
            className="full-button"
            list={list(fonts)}
            type="click"
            dropDownType="primary"
            withIcon={true}
            highlightActive={true}
            withArrow={false}
            closeAfterSelect={true}
        >
            <FontFamilyIcon />
        </Dropdown>
    );
}
