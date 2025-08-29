import React from "react";
import "./fontFamily.css";
import { IRTEPluginInitializer } from "@contentstack/app-sdk/dist/src/RTE/types";
import { FMIcon, FontComponent } from "./components";

export const createFontFamily = (RTE: IRTEPluginInitializer) => {
    //@ts-ignore
    const FontFamily = RTE("font-family", (rte: IRteParamWithConfig) => {
        // setting rte to window object to access later
        if (!window.rte && rte) {
            window.rte = rte;
        }
        return {
            title: "Font Family",
            icon: <FMIcon font={rte.getConfig().font_family} />,
            render: (props: any) => {
                return <FontComponent {...props} />;
            },
            displayOn: ["toolbar"],
            elementType: ["text"],
        };
    });

    //@ts-ignore
    FontFamily.on("exec", () => {});

    return FontFamily;
};
