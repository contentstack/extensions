import ContentstackSDK from "@contentstack/app-sdk";
import { contentIntelligenceIcon } from './content-intelligence/index';
import { createAutoSuggestion } from './auto-suggestion';
import { createSpellCheck } from './spell-check';
import {createGrammarCheck} from './grammar-check'

export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk["location"];
    const RTE = await extensionObj["RTEPlugin"];

    if(!RTE) return;
    
    const ContentIntelligence = contentIntelligenceIcon(RTE)
    const AutoSuggestion = createAutoSuggestion(RTE)
    const SpellCheck = createSpellCheck(RTE)
    const GrammarCheck = createGrammarCheck(RTE)

    return {
        ContentIntelligence,
        GrammarCheck,
        SpellCheck,
        AutoSuggestion
    };
});
