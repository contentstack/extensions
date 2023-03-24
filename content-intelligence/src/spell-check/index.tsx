// /** @jsx jsx */
import React from "react";
import { getSpellSuggestion } from "./getSpellSuggestion";
import "./style.css";
import SpellComponent from "./SpellComponent";
import isHotkey from 'is-hotkey'
import { IRTEPluginInitializer } from "@contentstack/app-sdk/dist/src/RTE/types";
import { IAIRTEInstance } from "../content-intelligence/types";

export const createSpellCheck = (RTE: IRTEPluginInitializer) => {
  //@ts-ignore
  const SpellCheckPlugin = RTE("spell-check", (rte: IAIRTEInstance) => {
    const handleClick = (spelling:string) => {
      rte._adv.Transforms.move(rte._adv.editor,{unit:"word"})
      rte._adv.editor.deleteBackward("word")
      rte._adv.Editor.insertText(rte._adv.editor, spelling);
    };

    return {
      display: [],
      elementType: ["text"],
      render: (props: any) => {
        return <SpellComponent {...props} handleClick={handleClick} />;
      },
    };
  });


  return SpellCheckPlugin
};


