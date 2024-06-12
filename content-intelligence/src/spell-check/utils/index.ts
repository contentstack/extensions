import debounce from "debounce"
import { getSpellSuggestion } from "../getSpellSuggestion"
import { IAIRTEInstance, ICIFeatures, IRTEDecorate } from '../../content-intelligence/types';
import { BaseRange } from 'slate/dist/interfaces/range'
export const reRenderElement = (rte: IAIRTEInstance) => {
    // HACK: to rerender current element
    rte._adv.Editor.addMark(rte._adv.editor, 'spell-check-sync', true)
    rte._adv.Editor.removeMark(rte._adv.editor, 'spell-check-sync')
}
export const triggerSpellCheck = async (rte: IAIRTEInstance, text: string) => {

    const spellCheckContext = rte.CIAppResponse.spellResponse
    if (!rte?.CIFeatures?.spellCorrection || !text.length) {
        return []
    }
    const AIResponse = await getSpellSuggestion(text)

    if (!AIResponse.contentToReplace) {
        return
    }
    AIResponse.contentToReplace.forEach((replaceDTO) => {
        if (spellCheckContext.incorrectWithSuggestedResponseMap.has(replaceDTO.incorrect_input)) {
            const incorrectSpellPreviousValue = spellCheckContext.incorrectWithSuggestedResponseMap.get(replaceDTO.incorrect_input)
            replaceDTO.corrected_input.forEach((correctOptions) => {
                incorrectSpellPreviousValue?.add(correctOptions)
            })
        } else {
            spellCheckContext.incorrectWithSuggestedResponseMap.set(replaceDTO.incorrect_input, new Set(replaceDTO.corrected_input))
        }
    })
    rte.CIAppResponse.spellResponse = spellCheckContext
}
export const debouncedTriggerSpellCheck = debounce(async (updatedRTE: IAIRTEInstance) => {
    const [closestBlockElementEntry] = updatedRTE._adv.Editor.nodes(updatedRTE._adv.editor, {
        match: (node, _path) => {
            return updatedRTE._adv.Editor.isBlock(updatedRTE._adv.editor, node)
        },
        mode: "lowest"
    })
    if (!closestBlockElementEntry) { return }
    const closestBlockElementPath = closestBlockElementEntry[1]
    const currentNodeText = updatedRTE.string(closestBlockElementPath)
    triggerSpellCheck(updatedRTE, currentNodeText)
        .finally(() => {
            reRenderElement(updatedRTE)
        })
    
}, 500)
export const spellCheckDecorate = (rte: IAIRTEInstance) => {
    const handleDecorate: IRTEDecorate = ([node, path]) => {
        const spellResponse = rte?.CIAppResponse?.spellResponse
        const ranges: Array<BaseRange & { "spell-check": Set<string> }> = [];

        if (!rte._adv.Text.isText(node) || !node?.text?.length) {
            return ranges;
        }

        const wordsInText = node.text.split(" ")
        wordsInText.reduce((actualIndex, word, indexOfWordInArray) => {
            if (spellResponse.incorrectWithSuggestedResponseMap.has(word)) {
                ranges.push({
                    //@ts-ignore
                    "spell-check": spellResponse.incorrectWithSuggestedResponseMap.get(word),
                    anchor: { path, offset: actualIndex },
                    focus: { path, offset: actualIndex + word.length },
                });
            }
            return actualIndex + word.length + 1
        }, 0)
        return ranges;
    };
    return handleDecorate
}

export const getEntriesStringForRTE = (rte: IAIRTEInstance) => {
    return rte._adv.Editor.string(rte._adv.editor, [0], { voids: true })
}