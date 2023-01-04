declare global {
    interface Window {
        postRobot: any;
    }
}
export declare const getSpellSuggestion: (text: any) => Promise<any>;
