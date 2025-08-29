import { IRteParam, IRTEPluginInitializer } from "@contentstack/app-sdk/dist/src/RTE/types";

export interface fontFamilyConfig {
    font: {
        name: string;
        url: string;
    }[];
}
export interface IRteParamWithConfig extends IRteParam {
    getConfig: () => {
        font_family: {
            font: fontFamilyConfig;
        };
    };
}
