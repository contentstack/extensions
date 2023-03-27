import { IAIRTEInstance } from "../../../content-intelligence/types";
declare global {
    interface Window {
        postRobot: any;
        rte: IAIRTEInstance;
    }
}
export declare const getAPISuggestion: (text: any) => Promise<any>;
