declare global {
    interface Window {
        postRobot: any;
    }
}
export declare const getGrammerSuggestion: (text: any) => Promise<any>;
