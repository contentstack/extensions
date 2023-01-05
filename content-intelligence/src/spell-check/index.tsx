// /** @jsx jsx */
//@ts-nocheck
import React from "react";
import { getSpellSuggestion } from "./getSpellSuggestion";
import "./style.css";
import SpellComponent from "./SpellComponent";
import isHotkey from 'is-hotkey'

export const createSpellCheck = (RTE: IRTEPluginInitializer) => {
  let response = [];

  const SpellCheckPlugin = RTE("spell-check", (rte: any) => {
    const handleClick = (spelling) => {
      let resp = Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).find((elem) => {
        return (
          rte.selection.get().anchor.offset > elem.start_offset &&
          rte.selection.get().anchor.offset <= elem.end_offset
        );
      });
      if (resp) {
        let deletePath = {
          anchor: {
            path: [...rte.selection.get().anchor.path],
            offset: resp.start_offset,
          },
          focus: {
            path: [...rte.selection.get().anchor.path],
            offset: resp.end_offset + 1,
          },
        };
        let insertPath = {
          anchor: {
            path: [...rte.selection.get().anchor.path],
            offset: resp.start_offset,
          },
          focus: {
            path: [...rte.selection.get().anchor.path],
            offset: resp.start_offset,
          },
        };
        rte.selection.set(deletePath);
        rte.deleteText();
        rte.selection.set(insertPath);
        rte._adv.Editor.insertText(rte._adv.editor, spelling);
        
        const deleteResponseindex = rte?.CIAppResponse?.spellResponse?.contentToReplace.indexOf(resp);
        if (deleteResponseindex > -1) {
          rte?.CIAppResponse?.spellResponse?.contentToReplace.splice(deleteResponseindex, 1); 
          if(rte?.CIAppResponse?.spellResponse?.contentToReplace?.length > 0){
            //corrected output's length > incorrect input's length
            if(spelling.length > resp.incorrect_input.length){
              let difference = spelling.length - resp.incorrect_input.length
              Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {

                  // if(index >= deleteResponseindex){
                    elem.start_offset = elem.start_offset + difference
                    elem.end_offset = elem.end_offset + difference
                  // }
                return elem
              })
            }
            //corrected output's length < incorrect input's length
            if(spelling.length < resp.incorrect_input.length){
              let difference =  resp.incorrect_input.length - spelling.length
              Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {
                  // if(index >= deleteResponseindex){
                    elem.start_offset = elem.start_offset - difference
                    elem.end_offset = elem.end_offset - difference
                  // }
                return elem
              })
            }
          }
        }
      }
    };

    return {
      display: [],
      elementType: ["text"],
      render: (props: any) => {
        return <SpellComponent {...props} handleClick={handleClick} />;
      },
    };
  });

  SpellCheckPlugin.on("keydown", async (props) => {
    const {rte, event} = props
    if(rte?.CIFeatures[2].name === 'Spell Correction' && rte?.CIFeatures[2].isEnabled === false ){
      return
    }
    props["editor"] = rte._adv.editor
    if (response?.contentToReplace?.length > 0) {
      const input = String.fromCharCode(event.keyCode);
      if (/[a-zA-Z0-9-_ ]/.test(input) || event.keyCode >= 186 && event.keyCode <=192 || event.keyCode >= 219 && event.keyCode <= 222 || !isHotkey('ctrl+a') || !isHotkey('ctrl+c') || !isHotkey('ctrl+v')) {
        if(rte.selection.get().anchor.offset <= response?.contentToReplace[0].start_offset){
          Array.from(response.contentToReplace).map((elem, index) => {
              elem.start_offset = elem.start_offset + 1;
              elem.end_offset = elem.end_offset + 1;
            return elem;
          });
        }
        else{
          let element = Array.from(response.contentToReplace).find((elem, index) => {
            if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= response.contentToReplace[index - 1]?.end_offset){
              
              return elem
            }
          })
          if(element){
            Array.from(response.contentToReplace).map((elem, index) => {
          if(index >= response.contentToReplace.indexOf(element)){
            elem.start_offset = elem.start_offset + 1;
            elem.end_offset = elem.end_offset + 1;
          }
          return elem;
        });
          }

        }
      }
      if(event.keyCode === 8){
        if(rte.selection.get().anchor.offset <= response?.contentToReplace[0].start_offset){
          Array.from(response.contentToReplace).map((elem, index) => {
              elem.start_offset = elem.start_offset - 1;
              elem.end_offset = elem.end_offset - 1;
            return elem;
          });
        }
        else{
          let element = Array.from(response.contentToReplace).find((elem, index) => {
            if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= response.contentToReplace[index - 1]?.end_offset){
              
              return elem
            }
          })
          if(element){
            Array.from(response.contentToReplace).map((elem, index) => {
          if(index >= response.contentToReplace.indexOf(element)){
            elem.start_offset = elem.start_offset - 1;
            elem.end_offset = elem.end_offset - 1;
          }
          return elem;
        });
          }

        }
      }
    }
  });

  return SpellCheckPlugin
};


