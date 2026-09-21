import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";

/**
 * The RTE instance, shared by the three font sub-plugins in this bundle.
 *
 * This used to live on `window.rte`. Every plugin configured on a field is
 * loaded into the same rte-extension iframe, so an unnamespaced global there is
 * shared with every other Marketplace plugin the editor has installed. Module
 * scope keeps it private to this bundle.
 */
let rteInstance: IRteParam | null = null;

/** First writer wins, matching the previous `if (!window.rte)` behaviour. */
export const setRte = (rte: IRteParam | void) => {
    if (!rteInstance && rte) {
        rteInstance = rte;
    }
};

export const getRte = (): IRteParam | null => rteInstance;

/** Adds a mark, or no-ops if the plugin has not been handed an RTE instance. */
export const addMark = (key: string, value: any) => {
    if (!rteInstance) {
        console.warn(`[font-app] no RTE instance available; dropped mark "${key}"`);
        return;
    }
    rteInstance.addMark(key, value);
};
