/** @jsx jsx */
//@ts-nocheck
import {renderAutoSuggestion, renderSuggestion} from './utils'
let key: any;

export const createAutoSuggestion = (RTE: IRTEPluginInitializer) => {
  const AutoSuggestionPlugin = RTE("auto-suggestion", (rte: any) => {
    return {
      displayOn: [],
    };
  });
  //TODO: add var for textcontent
  AutoSuggestionPlugin.on('keydown', (props) => {    
  const {rte, event} = props

  if(rte?.CIFeatures[0].name === 'Auto Suggestion' && rte?.CIFeatures[0].isEnabled === false ){
    return
  }

  props["editor"] = rte._adv.editor
  key = event.key
  const shadowDiv = document.getElementById('shadowDiv')
  const shadowTextContent = shadowDiv?.childNodes[0]?.textContent
  if(event.key === 'Tab' && shadowTextContent?.length > 0){
    event.preventDefault()
    rte.insertText(shadowTextContent, {at: rte.selection.get()})
    shadowDiv?.childNodes[0].innerHTML = ''
  }
  if(event.keyCode === 32){
    renderAutoSuggestion(rte, key)
  }
  else{
    if(shadowTextContent?.length > 0){
      renderSuggestion(window.getSelection()?.anchorNode, shadowTextContent, key, false)
    }
}   
  })

  AutoSuggestionPlugin.on('change', ({event, rte}: any) => {
    // renderAutoSuggestion(rte, key)
  })

  return AutoSuggestionPlugin
};

