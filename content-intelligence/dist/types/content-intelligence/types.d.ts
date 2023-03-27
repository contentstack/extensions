import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";
import { Node, NodeEntry } from "slate/dist/interfaces/node";
import { BaseRange } from "slate/dist/interfaces/range";
import { Text, TextInterface } from "slate/dist/interfaces/text";
import { EditorInterface } from "slate/dist/interfaces/editor";
interface IAdvRte {
    Text: TextInterface;
    Editor: EditorInterface;
    addToDecorate: Function;
}
export interface ICIFeatures {
    "autoSuggestion": boolean;
    "spellCorrection": boolean;
}
interface extendedRTEParams {
    CIFeatures: ICIFeatures;
    CIAppResponse: {
        spellResponse: {
            incorrectWithSuggestedResponseMap: Map<string, Set<string>>;
        };
    };
    _adv: IRteParam['_adv'] & IAdvRte;
}
export declare type IAIRTEInstance = IRteParam & extendedRTEParams;
export declare type IRTEDecorate = (entry: NodeEntry<Node | Text>) => Array<BaseRange>;
export {};
