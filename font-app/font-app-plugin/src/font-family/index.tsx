import React from "react";
import "./fontFamily.css";
import { IRTEPluginInitializer, IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";
import { FMIcon, FontComponent } from "./components";
import { setRte } from "../rteRef";

export const createFontFamily = (RTE: IRTEPluginInitializer) => {
    //@ts-ignore
    const FontFamily = RTE("font-family", (rte: IRteParam) => {
        setRte(rte);
        return {
            title: "Font Family",
            // The configuration is read inside FMIcon rather than here: this
            // callback runs once, while `rte.getConfig()` resolves later.
            icon: <FMIcon rte={rte} />,
            render: (props: any) => {
                return <FontComponent {...props} />;
            },
            displayOn: ["toolbar", "hoveringToolbar"],
            elementType: ["text"],
        };
    });

    //@ts-ignore
    FontFamily.on("exec", () => {});

    return FontFamily;
};
