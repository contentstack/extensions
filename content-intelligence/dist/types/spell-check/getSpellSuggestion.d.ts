declare global {
    interface Window {
        postRobot: any;
    }
}
interface ISpellCorrectionDTO {
    "incorrect_input": string;
    "corrected_input": Array<string>;
    "start_offset": number;
    "end_offset": number;
}
interface ISpellCheckResponse {
    contentToReplace: Array<ISpellCorrectionDTO>;
}
export declare const getSpellSuggestion: (body: string) => Promise<ISpellCheckResponse>;
export {};
