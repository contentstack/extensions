/** @jsx jsx */
//@ts-nocheck
import {renderAutoSuggestion, renderSuggestion} from './utils'
let key: any;

export const createAutoSuggestion = (RTE: IRTEPluginInitializer) => {
  console.log("auto suggestion plugin loaded")
  const AutoSuggestionPlugin = RTE("auto-suggestion", (rte: any) => {
    return {
      displayOn: [],
    };
  });

  AutoSuggestionPlugin.on('keydown', (props) => {
    const {rte, event} = props
    props["editor"] = rte._adv.editor
    key = event.key
    if(event.key === 'Tab' && document.getElementById('shadowDiv')?.childNodes[0]?.textContent?.length > 0){
      event.preventDefault()
      rte.insertText(document.getElementById('shadowDiv')?.childNodes[0].textContent, {at: rte.selection.get()})
      document.getElementById('shadowDiv').childNodes[0].innerHTML = ''
    }
    if(event.keyCode === 32){
      renderAutoSuggestion(rte, key)
    }
    else{
      if(document.getElementById('shadowDiv')?.childNodes[0].textContent?.length > 0){
        renderSuggestion(window.getSelection()?.anchorNode, document.getElementById('shadowDiv')?.childNodes[0]?.textContent, key, false)
      }
    }

  })

  AutoSuggestionPlugin.on('change', ({event, rte}: any) => {
    // renderAutoSuggestion(rte, key)
  })

  return AutoSuggestionPlugin
};

