import { IRTEPluginInitializer } from "@contentstack/app-sdk/dist/src/RTE/types";
import React from "react";
import { IRteParamWithConfig } from "../font-family/types";
import { ColorComponent, FCIcon } from "./components";

export const createFontColor = (RTE: IRTEPluginInitializer) => {
    //@ts-ignore
    const FontColor = RTE("font-color", (rte: IRteParamWithConfig) => {
        // setting rte to window object to access later
        if (!window.rte && rte) {
            window.rte = rte;
        }
        return {
            title: "Font Color",
            icon: <FCIcon />,
            render: (props: any) => {
                return <ColorComponent {...props} />;
            },
            displayOn: ["toolbar"],
            elementType: ["text"],
        };
    });

    //@ts-ignore
    FontColor.on("exec", (rte) => {});

    return FontColor;
};
