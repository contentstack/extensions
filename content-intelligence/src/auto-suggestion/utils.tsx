
import React from 'react'
import { getSuggestion } from "./getSuggestionFromProvider/getSuggestion"
import { debounce } from "lodash"

// let debouncedCallback = debounce(getSuggestion, 500);

 export const renderAutoSuggestion = async (rte: any, key: any) => {
    let editorSelection = rte.selection.get()
    if(editorSelection && key !== 'Tab'){
      let nodeText = rte.getNode(rte.selection.get())[0].text
       if(nodeText && nodeText.trim().length !== 0){
        if(!document.getElementById('shadowDiv')){
          let suggestion = await getSuggestion(nodeText, 'data-api')
          if(suggestion){
              renderSuggestion(window.getSelection()?.anchorNode, suggestion, key, true)
          }
        }
        else{
          if(document.getElementById('shadowDiv')?.childNodes[0]?.textContent === ''){
            let suggestion = await getSuggestion(nodeText, 'data-api')
            if(suggestion){
                renderSuggestion(window.getSelection()?.anchorNode, suggestion, key, true)
            }
          }
          else{
            renderSuggestion(window.getSelection()?.anchorNode, document.getElementById('shadowDiv')?.childNodes[0].textContent, key, false)
          }
        }
       }
      }
 }

export const renderSuggestion = (anchorNode: any, shadowText: any, key: any, boolean: any) => {
    const range = document.createRange()
    if(!document.getElementById('shadowDiv')){
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
    const child = document.getElementById('shadowDiv')?.childNodes[0]
    if(key === 'Shift'){
      return
    }
    if(child){
      if (key === shadowText[0]) {
        child.textContent = shadowText.substr(1);
      }
      else if (boolean) {
        child.textContent = shadowText
      }
      else {
        child.textContent = ''
      }
    }
  }
  }

  // export default function HeaderToggleSwitch() {
  //   const editor = useSlate() as ExtendedEditor
  //   const isTableDisable = tableHeaderButtonDisabler({ editor })
  //   const headerExist = doesTableHeaderExist({ editor })
  //   const selection: any = editor.selection || editor.savedSelection
  
  //   const handleMouseDown = (event) => {
  //     if (selection) {
  //       Transforms.select(editor, selection)
  //       if (!isTableDisable) {
  //         handleHeaderToggle(event, editor, !headerExist)
  //       }
  //     }
  //   }
  //   const handleCheckbox = (event) => {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     if (selection) {
  //       Transforms.select(editor, selection)
  //       if (!isTableDisable) {
  //         handleHeaderToggle(event, editor, !headerExist)
  //       }
  //     }
  //   }
  //   return (
  //     <span
  //       data-testid="table-header-btn"
  //       className={cx(styles['table-header-btn'], {
  //         [styles['table-header-btn--disable']]: isTableDisable
  //       })}
  //       onMouseDown={handleMouseDown}>
  //       <span>Header row </span>
  //       <span style={{ display: 'flex' }}>
  //         <Switch disabled={isTableDisable} onChange={handleCheckbox} checked={headerExist} />
  //       </span>
  //     </span>
  //   )
  // }