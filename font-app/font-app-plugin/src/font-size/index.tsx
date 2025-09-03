import React from "react";
import { IRteParam, IRTEPluginInitializer } from '@contentstack/app-sdk/dist/src/RTE/types'
import { FontSizeDropdown, FontSizeComponent } from "./components";

declare global {
  interface Window { rte: IRteParam; }
}

export const createFontSize = (RTE: IRTEPluginInitializer ) => {
    const FontSize = RTE("font-size", (rte:IRteParam|void) => {
        // setting rte to window object to access later
        if (!window.rte && rte) {
            window.rte = rte;
        }
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
