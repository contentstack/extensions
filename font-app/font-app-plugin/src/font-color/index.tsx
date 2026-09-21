import { IRTEPluginInitializer, IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";
import React from "react";
import { ColorComponent, FCIcon } from "./components";
import { setRte } from "../rteRef";

export const createFontColor = (RTE: IRTEPluginInitializer) => {
    //@ts-ignore
    const FontColor = RTE("font-color", (rte: IRteParam) => {
        setRte(rte);
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
