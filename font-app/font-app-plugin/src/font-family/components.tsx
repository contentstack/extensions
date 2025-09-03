import React from "react";
import { Dropdown } from "@contentstack/venus-components";

import FONTS from "./font";
import { fontFamilyConfig } from "./types";

// component to be rendered
export const FontComponent = (props: any) => {
    const { leaf, children, attrs, attributes } = props;
    return (
        <span
            {...attrs}
            {...attributes}
            style={{ fontFamily: leaf["font-family"] }}
        >
            {...children}
        </span>
    );
};

// Dropdown icon
const list = (fontList:fontFamilyConfig) => {
    const configFonts = fontList?.font?.map((item) => item.name) || [];
    const fonts = [...configFonts, ...FONTS];
    return fonts.map((font) => {
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
                const { rte } = window;
                rte.addMark("font-family", font);
            },
            highlightActive: true,
        };
    });
};

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

export function FMIcon(font: fontFamilyConfig) {
    return (
        <Dropdown
            className="full-button"
            list={list(font)}
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
