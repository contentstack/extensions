// /** @jsx jsx */
//@ts-nocheck
import React from "react";
import "./style.css";
import GrammarComponent from "./GrammarComponent";
import { getGrammerSuggestion } from "./getGrammerSuggestion";

export const createGrammarCheck = (RTE: IRTEPluginInitializer) => {
  let response = [];

  const GrammerCheckPlugin = RTE("grammar-check", (rte: any) => {
    const handleDecorate = ([node, path]) => {
      let ranges = [];

      if (!rte._adv.Text.isText(node)) {
        return ranges;
      }
      if (response?.contentToReplace) {
        Array.from(response?.contentToReplace).forEach((elem) => {
          let value = { ...elem };
          ranges.push({
            "grammar-check": value,
            anchor: { path, offset: elem.start_offset },
            focus: { path, offset: elem.end_offset + 1 },
          });
        });
      }
      return ranges;
    };
    rte._adv.addToDecorate(handleDecorate);

    const handleClick = () => {
      let resp = Array.from(response.contentToReplace).find((elem) => {
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
        const index = response.contentToReplace.indexOf(resp);
        if (index > -1) {
          response.contentToReplace.splice(index, 1); // 2nd parameter means remove one item only
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

GrammerCheckPlugin.on("keydown", async ({ event, rte }) => {
  const {rte, event} = props
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
      // if(event.keyCode === 32){
      //   console.log('response', response)
      // }
    }
    
    if (event.key === ".") {
      response = await getGrammerSuggestion(
        rte.getNode(rte.selection.get())[0].text
      );
    }
    rte.selection.get();
    rte.selection.set(rte.selection.get());
  });

  return GrammerCheckPlugin
};
