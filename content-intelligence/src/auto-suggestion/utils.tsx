
import { getSuggestion } from "./getSuggestionFromProvider/getSuggestion"

 export const renderAutoSuggestion = async (rte: any, key: any) => {
    let editorSelection = rte.selection.get()
    if(!editorSelection || key === 'Tab'){
      return
    }
      let nodeText = rte.getNode(rte.selection.get())[0].text
      let shadowDiv = document.getElementById('shadowDiv')
      
       if(nodeText && nodeText.trim().length !== 0){
        if(!shadowDiv){
          let suggestion = await getSuggestion(nodeText, 'data-api')
          if(suggestion){
              renderSuggestion(window.getSelection()?.anchorNode, suggestion, key, true)
          }
        }
        else{
          if(shadowDiv?.childNodes[0]?.textContent === ''){
            let suggestion = await getSuggestion(nodeText, 'data-api')
            if(suggestion){
                renderSuggestion(window.getSelection()?.anchorNode, suggestion, key, true)
            }
          }
          else{
            renderSuggestion(window.getSelection()?.anchorNode, shadowDiv?.childNodes[0].textContent, key, false)
          }
        }
       }
      // }
 }

export const renderSuggestion = (anchorNode: any, shadowText: any, key: any, boolean: any) => {
    const range = document.createRange()
    let shadowDiv = document.getElementById('shadowDiv')
    if(!shadowDiv){
      const div = document.createElement('div');
      div.style.display = 'inline';
      div.id = 'shadowDiv'
      div.contentEditable = 'false'
      const span = document.createElement('span');
    
      span.style.fontSize = '14px'
      span.style.color = 'gray'
      div.appendChild(span);
      if (key === shadowText[0]) {
        shadowText = shadowText.substr(1);
      }
      else if (boolean) {
        shadowText = shadowText
      }
      else {
        shadowText = ''
      }
      span.appendChild(document.createTextNode(shadowText));
      range.setStartAfter(anchorNode);
      range.setEndAfter(anchorNode);
      range.collapse(false)
      range.insertNode(div);
    }
  else{
    const child = shadowDiv?.childNodes[0]
    if(key === 'Shift' || !child){
      return
    }
    // if(child){
      if (key === shadowText[0]) {
        child.textContent = shadowText.substr(1);
      }
      else if (boolean) {
        child.textContent = shadowText
      }
      else {
        child.textContent = ''
      }
    // }
  }
  }