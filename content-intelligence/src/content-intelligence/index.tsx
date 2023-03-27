import React from 'react';
import isHotkey from 'is-hotkey'
import CI_Features from './ciFeatures';

import './style.css'
import { IRTEPluginInitializer } from '@contentstack/app-sdk/dist/src/RTE/types';
import { IAIRTEInstance } from './types';
import { debouncedTriggerSpellCheck, debouncedTriggerSpellCheckForCompleteRTE, getEntriesStringForRTE, spellCheckDecorate, triggerSpellCheck, triggerSpellCheckForCompleteRTE } from '../spell-check/utils';
import { CIComponent, CIIcon } from './components';

export const contentIntelligenceIcon = (RTE: IRTEPluginInitializer) => {
  // @ts-ignore
  const ContentIntelligence = RTE('content-intelligence', (rte: IAIRTEInstance) => {
    rte.CIFeatures = CI_Features
    rte.CIAppResponse = {
      spellResponse: {
        incorrectWithSuggestedResponseMap: new Map()
      }
    }
    const handleDecorate = spellCheckDecorate(rte)
    rte._adv.addToDecorate(handleDecorate);

    // To execute the spell check for first time.
    triggerSpellCheckForCompleteRTE(rte)

    return ({
      title: 'Content Intelligence',
      icon: <CIIcon rte={rte} />,
      render: (props) => { return <CIComponent {...props} /> },
      display: ['toolbar']
    })
  });
  // @ts-ignore
  ContentIntelligence.on('exec', (rte: IAIRTEInstance) => {
    if (!window.rte) {
      window.rte = rte;
    }
    if (!rte?.CIFeatures?.spellCorrection) {
      rte.CIAppResponse.spellResponse = {
        incorrectWithSuggestedResponseMap: new Map()
      }
    }
  })

  ContentIntelligence.on('keydown', async (props) => {
    const { rte, event } = props
    const updatedRTE: IAIRTEInstance = rte as any
    if(isHotkey('mod',event)){
      // Early return if ctrl
      return
    }
    if(isHotkey('mod+v',event) || isHotkey('mod+x',event)){
      debouncedTriggerSpellCheckForCompleteRTE(updatedRTE)
      return
    }
    debouncedTriggerSpellCheck(updatedRTE)
  })
  return ContentIntelligence
}