import { IAIRTEInstance, IRTEDecorate } from '../../content-intelligence/types';
export declare const reRenderElement: (rte: IAIRTEInstance) => void;
export declare const triggerSpellCheck: (rte: IAIRTEInstance, text: string) => Promise<never[] | undefined>;
export declare const debouncedTriggerSpellCheck: ((updatedRTE: IAIRTEInstance) => Promise<void>) & {
    clear(): void;
} & {
    flush(): void;
};
export declare const spellCheckDecorate: (rte: IAIRTEInstance) => IRTEDecorate;
export declare const getEntriesStringForRTE: (rte: IAIRTEInstance) => string;
export declare const triggerSpellCheckForCompleteRTE: (rte: IAIRTEInstance) => void;
export declare const debouncedTriggerSpellCheckForCompleteRTE: ((rte: IAIRTEInstance) => void) & {
    clear(): void;
} & {
    flush(): void;
};
