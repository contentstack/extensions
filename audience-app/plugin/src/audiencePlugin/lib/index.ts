import { ReactNode } from "react";

export const fieldExtractor = (group: any[] = [], group_title) => {
    return group.map((field) => {
        if (!field[group_title]) throw new Error("field is missing");
        return {
            label: field[group_title],
            value: field[group_title],
        };
    });
};


export const isPrePostTagsPresent = (nodeList: {type: string; uid: string; attrs: any; children: ReactNode[]}[]): boolean => {
    const isPreTagPresent = nodeList.some(node => node.type === "audience-pre");
    const isPostTagPresent = nodeList.some(node => node.type === "audience-post");
    return isPreTagPresent && isPostTagPresent;
}