// /** @jsx jsx */
//@ts-nocheck
import React from "react";
import { getSpellSuggestion } from "./getSpellSuggestion";
import "./style.css";
import SpellComponent from "./SpellComponent";
import isHotkey from 'is-hotkey'

export const createSpellCheck = (RTE: IRTEPluginInitializer) => {
  const SpellCheckPlugin = RTE("spell-check", (rte: any) => {
    const handleClick = (spelling) => {
      let respTest = Array.from(rte?.CIAppResponse?.spellResponse).find((response) => {
        return JSON.stringify(rte.selection.get().anchor.path) === JSON.stringify(response[1])
      })
  
     let resp =  Array.from(respTest[0]?.['contentToReplace']).find((elem) => {
      if(rte.selection.get().anchor.offset > elem.start_offset && rte.selection.get().anchor.offset <= elem.end_offset){
        return elem
      }
      })
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

        const deleteResponseindex = Array.from(rte?.CIAppResponse?.spellResponse).indexOf(respTest)
        if (deleteResponseindex > -1) {
          let respIndex = rte?.CIAppResponse?.spellResponse?.[deleteResponseindex][0].contentToReplace.indexOf(resp)
          let path = rte.selection.get().anchor.path
          rte?.CIAppResponse?.spellResponse?.[deleteResponseindex]?.[0]?.contentToReplace.splice(respIndex, 1); 
          
          if(rte?.CIAppResponse?.spellResponse?.length > 0){
            Array.from(rte?.CIAppResponse?.spellResponse).forEach((response) => {
             if(JSON.stringify(path) === JSON.stringify(response?.[1])){
              return Array.from(response[0]['contentToReplace']).forEach((elem, index) => {                
                if(spelling.length > resp.incorrect_input.length){
                  let difference = spelling.length - resp.incorrect_input.length
                      if(index >= respIndex){
                        elem.start_offset = elem.start_offset + difference
                        elem.end_offset = elem.end_offset + difference
                      }
                    return elem
                }

                if(spelling.length < resp.incorrect_input.length){
                  let difference =  resp.incorrect_input.length - spelling.length
                      if(index >= respIndex){
                        elem.start_offset = elem.start_offset - difference
                        elem.end_offset = elem.end_offset - difference
                      }
                    return elem
                }
              })
             }      
            })
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
    if(rte?.CIFeatures[1].name === 'Spell Correction' && rte?.CIFeatures[1].isEnabled === false ){
      return
    }
    props["editor"] = rte._adv.editor
    const findResponseForPath = (spellResponse) => {
      return Array.from(spellResponse).find((response) => {
        return JSON.stringify(rte.selection.get().anchor.path) === JSON.stringify(response[1])
      })
    }
    if (rte?.CIAppResponse?.spellResponse?.length > 0) {
      const input = String.fromCharCode(event.keyCode);
      if (/[a-zA-Z0-9-_ ]/.test(input) || event.keyCode >= 186 && event.keyCode <=192 || event.keyCode >= 219 && event.keyCode <= 222 || !isHotkey('ctrl+a') || !isHotkey('ctrl+c') || !isHotkey('ctrl+v')) {
        let change = findResponseForPath(rte?.CIAppResponse?.spellResponse)
        if(change){
          Array.from(change[0]['contentToReplace']).forEach((elem) => {
            //change the offset of all the responses whose start offset is > rte selection by +1
            if(elem?.start_offset >= rte.selection.get().anchor.offset ){
              elem.start_offset = elem.start_offset + 1;
              elem.end_offset = elem.end_offset + 1;
              return elem
            }
            else{
              //yet to identify
            }
          })
        }
  //       Array.from(rte?.CIAppResponse?.spellResponse).forEach((response) => {
  //         return Array.from(response[0]['contentToReplace']).forEach((elem, index) => {
  //           // console.log("OFFSETS: ", rte.selection.get().anchor.offset, elem?.start_offset);
            
  // //           if(rte.selection.get().anchor.offset <= elem?.start_offset){
  // //                 elem.start_offset = elem.start_offset + 1;
  // //                 elem.end_offset = elem.end_offset + 1;
  // //               return elem;
  // //           }
  // //           else{
  // //             let element = Array.from(rte?.CIAppResponse?.spellResponse).find((response) =>{
  // //               return Array.from(response[0]['contentToReplace']).find((elem, index)=>{
  // //                 if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= response[0]?.contentToReplace[index - 1]?.end_offset){
  // //                   return elem
  // //                 }
  // //               })
  // //             })
  // //             // let element = Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).find((elem, index) => {
  // //             //   if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= rte?.CIAppResponse?.spellResponse?.contentToReplace[index - 1]?.end_offset){
                  
  // //             //     return elem
  // //             //   }
  // //             // })
  // //             if(element){
  // //               console.log("element: ",element)

  // //               Array.from(rte?.CIAppResponse?.spellResponse).map((response, index) => {
  // //                 Array.from(response[0]?.['contentToReplace']).map((elem, index) => {
  // // if(index >= rte?.CIAppResponse?.spellResponse?.contentToReplace.indexOf(element)){
  // //               elem.start_offset = elem.start_offset + 1;
  // //               elem.end_offset = elem.end_offset + 1;
  // //             }
  // //                 })
            
  // //             return elem;
  // //           });
  // //             }
  // //           }
  //         })
  //       })
        
        // if(rte.selection.get().anchor.offset <= rte?.CIAppResponse?.spellResponse?.contentToReplace[0].start_offset){
        //   Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {
        //       elem.start_offset = elem.start_offset + 1;
        //       elem.end_offset = elem.end_offset + 1;
        //     return elem;
        //   });
        // }
        // else{
        //   let element = Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).find((elem, index) => {
        //     if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= rte?.CIAppResponse?.spellResponse?.contentToReplace[index - 1]?.end_offset){
              
        //       return elem
        //     }
        //   })
        //   if(element){
        //     Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {
        //   if(index >= rte?.CIAppResponse?.spellResponse?.contentToReplace.indexOf(element)){
        //     elem.start_offset = elem.start_offset + 1;
        //     elem.end_offset = elem.end_offset + 1;
        //   }
        //   return elem;
        // });
        //   }

        // }
      }
      if(event.keyCode === 8){   
        let change = findResponseForPath(rte?.CIAppResponse?.spellResponse)   
        if(change){
          Array.from(change[0]['contentToReplace']).forEach((elem) => {
            //change the offset of all the responses whose start offset is > rte selection by +1
            if(elem?.start_offset >= rte.selection.get().anchor.offset ){
              elem.start_offset = elem.start_offset - 1;
              elem.end_offset = elem.end_offset - 1;
              return elem
            }
            else{
              //yet to identify
            }
          })
        }
        // if(rte.selection.get().anchor.offset <= rte?.CIAppResponse?.spellResponse?.contentToReplace[0].start_offset){
        //   Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {
        //       elem.start_offset = elem.start_offset - 1;
        //       elem.end_offset = elem.end_offset - 1;
        //     return elem;
        //   });
        // }
        // else{          
        //   let element = Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).find((elem, index) => {
        //     if(rte.selection.get().anchor.offset <= elem.start_offset && rte.selection.get().anchor.offset >= rte?.CIAppResponse?.spellResponse?.contentToReplace[index - 1]?.end_offset){
        //       return elem
        //     }
        //   })
        //   if(element){
        //     Array.from(rte?.CIAppResponse?.spellResponse?.contentToReplace).map((elem, index) => {
        //   if(index >= rte?.CIAppResponse?.spellResponse?.contentToReplace.indexOf(element)){
        //     elem.start_offset = elem.start_offset - 1;
        //     elem.end_offset = elem.end_offset - 1;
        //   }
        //   return elem;
        // });
        //   }

        // }
      }
    }
  });

  return SpellCheckPlugin
};


