declare global {
    interface Window {
        postRobot: any;
    }
}
export declare const getAPISuggestion: (text: any) => Promise<any>;
