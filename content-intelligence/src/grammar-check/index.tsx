// /** @jsx jsx */
//@ts-nocheck
import React from "react";
import "./style.css";
import GrammarComponent from "./GrammarComponent";
import { getGrammerSuggestion } from "./getGrammerSuggestion";
import isHotkey from 'is-hotkey'

export const createGrammarCheck = (RTE: IRTEPluginInitializer) => {
  let response = [];


  const GrammerCheckPlugin = RTE("grammar-check", (rte: any) => {
    const handleClick = () => {
        let resp = Array.from(rte?.CIAppResponse?.grammarResponse.contentToReplace).find((elem) => {
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
          rte._adv.Editor.insertText(rte._adv.editor, resp.corrected_input);
  
          //new
          const deleteResponseindex = rte?.CIAppResponse?.grammarResponse.contentToReplace.indexOf(resp);
          if (deleteResponseindex > -1) {
            rte?.CIAppResponse?.grammarResponse.contentToReplace.splice(deleteResponseindex, 1);
            
            if (rte?.CIAppResponse?.grammarResponse.contentToReplace?.length > 0) {
              //corrected output's length > incorrect input's length
              if (resp.corrected_input.length > resp.incorrect_input.length) {
                let difference = resp.corrected_input.length - resp.incorrect_input.length
                Array.from(rte?.CIAppResponse?.grammarResponse.contentToReplace).map((elem, index) => {
  
                  if(index >= deleteResponseindex){
                  elem.start_offset = elem.start_offset + difference
                  elem.end_offset = elem.end_offset + difference
                  }
                  return elem
                })
              }
              //corrected output's length < incorrect input's length
              if (resp.corrected_input.length < resp.incorrect_input.length) {
                let difference = resp.incorrect_input.length - resp.corrected_input.length
                Array.from(rte?.CIAppResponse?.grammarResponse.contentToReplace).map((elem, index) => {
                  if(index >= deleteResponseindex){
                  elem.start_offset = elem.start_offset - difference
                  elem.end_offset = elem.end_offset - difference
                  }
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
        return <GrammarComponent {...props} handleClick={handleClick} />;
      },
    };
});

  GrammerCheckPlugin.on("keydown", async (props) => {
    const { rte, event } = props
    if (!rte?.CIFeatures.grammarCorrection) {
      return
    }
    props["editor"] = rte._adv.editor
    if (rte?.CIAppResponse?.grammarResponse?.contentToReplace?.length > 0) {
      const input = String.fromCharCode(event.keyCode);
      if (/[a-zA-Z0-9-_ ]/.test(input) || event.keyCode >= 186 && event.keyCode <= 192 || event.keyCode >= 219 && event.keyCode <= 222 || !isHotkey('ctrl+a') || !isHotkey('ctrl+c') || !isHotkey('ctrl+v')) {
        if (rte.selection.get().anchor.offset <= rte?.CIAppResponse?.grammarResponse?.contentToReplace[0].start_offset) {
          Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).map((elem, index) => {
            elem.start_offset = elem.start_offset + 1;
            elem.end_offset = elem.end_offset + 1;
            return elem;
          });
        }
        else {
          let element = Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).find((elem, index) => {
            if (rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= rte?.CIAppResponse?.grammarResponse.contentToReplace[index - 1]?.end_offset) {

              return elem
            }
          })
          if (element) {
            Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).map((elem, index) => {
              if (index >= rte?.CIAppResponse?.grammarResponse?.contentToReplace.indexOf(element)) {
                elem.start_offset = elem.start_offset + 1;
                elem.end_offset = elem.end_offset + 1;
              }
              return elem;
            });
          }

        }
      }
      if (event.keyCode === 8) {
        if (rte.selection.get().anchor.offset <= rte?.CIAppResponse?.grammarResponse?.contentToReplace[0].start_offset) {
          Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).map((elem, index) => {
            elem.start_offset = elem.start_offset - 1;
            elem.end_offset = elem.end_offset - 1;
            return elem;
          });
        }
        else {
          let element = Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).find((elem, index) => {
            if (rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= rte?.CIAppResponse?.grammarResponse.contentToReplace[index - 1]?.end_offset) {

              return elem
            }
          })
          if (element) {
            Array.from(rte?.CIAppResponse?.grammarResponse?.contentToReplace).map((elem, index) => {
              if (index >= rte?.CIAppResponse?.grammarResponse?.contentToReplace.indexOf(element)) {
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

  return GrammerCheckPlugin
};
