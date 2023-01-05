//@ts-nocheck
import React, {useState} from 'react';
import {Dropdown, Switch } from '@contentstack/venus-components'
import CI_Features from './ciFeatures';
import { Icon } from '../icons';
import { getSpellSuggestion } from '../spell-check/getSpellSuggestion';
import { getGrammerSuggestion } from '../grammar-check/getGrammerSuggestion';
//@ts-ignore
import './style.css'
import {cx} from '@emotion/css'

const CIComponent = (props:any) => {
    return <span {...props.attrs} {...props.attributes}>{props.children}</span>
}

export const contentIntelligenceIcon = (RTE:any) => {
    let spellResponse = []
    let grammarResponse = []
    const ContentIntelligence = RTE('content-intelligence', (rte: any) => {
        rte.CIAppResponse = {}
        const handleDecorate = ([node, path]) => {
            let ranges = [];
      
            if (!rte._adv.Text.isText(node)) {
              return ranges;
            }

            if (grammarResponse?.contentToReplace) {
                Array.from(grammarResponse?.contentToReplace).forEach((elem) => {
                  let value = { ...elem };
                  ranges.push({
                    "grammar-check": value,
                    anchor: { path, offset: elem.start_offset },
                    focus: { path, offset: elem.end_offset + 1 },
                  });
                });
              }

            if (spellResponse?.contentToReplace) {
              Array.from(spellResponse?.contentToReplace).forEach((elem) => {
                let value = { ...elem };
                ranges.push({
                  "spell-check": value,
                  anchor: { path, offset: elem.start_offset },
                  focus: { path, offset: elem.end_offset + 1 },
                });
              });
            }
            return ranges;
          };
          rte._adv.addToDecorate(handleDecorate);
        rte.CIFeatures = CI_Features
        return ({
            title: 'Content Intelligence',
            icon: <CIIcon/>,
            render: (props) => {return <CIComponent {...props}/>},
            display: ['toolbar']
        })
    });

    ContentIntelligence.on('exec', (rte:any) => {
        if(!window.rte) {
            window.rte = rte;
        }  
    })

    ContentIntelligence.on('keydown', async (props) => {
        const {rte, event} = props
        if (event.keyCode === 32) {
            if(rte?.CIFeatures[2].name === 'Spell Correction' && rte?.CIFeatures[2].isEnabled === false ){
                return
            }
            spellResponse = await getSpellSuggestion(
              rte.getNode(rte.selection.get())[0].text
            )
            if(spellResponse) rte.CIAppResponse['spellResponse'] = spellResponse
        }
        if (event.key === "." && rte.CIAppResponse?.['spellResponse']?.['contentToReplace'].length === 0) { 
            if (rte?.CIFeatures[1].name === 'Grammar Correction' && rte?.CIFeatures[1].isEnabled === false) {
                return
            }
            grammarResponse = await getGrammerSuggestion(
              `${rte.getNode(rte.selection.get())[0].text}.`
            );
            if(grammarResponse) rte.CIAppResponse['grammarResponse'] = grammarResponse
        }
        rte.selection.get();
        rte.selection.set(rte.selection.get());
    })
    return ContentIntelligence
}

const list = CI_Features.map((feature) => ({
    label:  <CiList feature = {feature}/>,
}))

function CIIcon() {
    return (
        <Dropdown list={list} type={'click'}>
            <Icon/>
        </Dropdown>
    )
}

function CiList (props) {
    const {feature} = props
    const [enabled, setEnabled] = useState(feature.isEnabled)
    let contentIntelligenceDom = document.querySelector('[data-icon="content-intelligence"]')
    const handleMouseDown = (event) => {
        setEnabled(!enabled) 
        feature.isEnabled = !enabled
    }
    if(enabled){
        contentIntelligenceDom?.setAttribute(`${feature['name'].toLowerCase().replace(' ', '_')}`, true)
    }
    else{
        contentIntelligenceDom?.setAttribute(`${feature['name'].toLowerCase().replace(' ', '_')}`, false)
    }
    return (
    <span
    data-testid="table-header-btn"
    className='table-header-btn'
    onMouseDown={handleMouseDown}
    >
    <span>{feature['name']}</span>
    <span style={{ display: 'flex' }}>
      <Switch enabled={enabled} setEnabled={setEnabled} feature={feature['name']}/>
    </span>
  </span>
    )
}

function Switch (props) {
  const {enabled, setEnabled, feature} = props

  return (
    <div
      id={`ci_${feature.toLowerCase().replace(' ', '_')}`} 
      data-testid="switch-toggle"
      className={cx('toggle-btn', 
      {'active': enabled}
      )}
      >
      <span 
        className='round-btn'
      ></span>
    </div>
  )
}