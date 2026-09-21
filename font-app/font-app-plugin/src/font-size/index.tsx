import React from "react";
import { IRteParam, IRTEPluginInitializer } from '@contentstack/app-sdk/dist/src/RTE/types'
import { FontSizeDropdown, FontSizeComponent } from "./components";
import { setRte } from "../rteRef";

export const createFontSize = (RTE: IRTEPluginInitializer ) => {
    const FontSize = RTE("font-size", (rte:IRteParam|void) => {
        setRte(rte);
        return {
            title: "Font Size",
            icon: <FontSizeDropdown />,
            render: (props: any) => {
                return <FontSizeComponent {...props} />;
            },
            displayOn: ["toolbar"],
            elementType: ["text"],
        };
    });

    //@ts-ignore
    FontSize.on('exec', () => {
        
    })
    return FontSize;
};
