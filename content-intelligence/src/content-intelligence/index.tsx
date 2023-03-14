//@ts-nocheck
import React, {useState} from 'react';
import {Dropdown, Switch } from '@contentstack/venus-components'
import CI_Features from './ciFeatures';
import { Icon } from '../icons';
import { getSpellSuggestion } from '../spell-check/getSpellSuggestion';

//@ts-ignore
import './style.css'
import {cx} from '@emotion/css'

const CIComponent = (props:any) => {
    return <span {...props.attrs} {...props.attributes}>{props.children}</span>
}

export const contentIntelligenceIcon = (RTE:any) => {
    let spellResponse = []

    const ContentIntelligence = RTE('content-intelligence', (rte: any) => {
        rte.CIAppResponse = {}
        const handleDecorate = ([node, path]) => {
          let ranges = [];
      
            if (!rte._adv.Text.isText(node)) {
              return ranges;
            }
            if(spellResponse.length > 0){
              console.log("spellResponse: ",spellResponse);
              
              Array.from(spellResponse).forEach((response) =>{
                if(response && response[0]?.contentToReplace){
                  Array.from(response[0]?.contentToReplace).forEach((elem) => {
                    let value = {...elem}
                    if(JSON.stringify(path) === JSON.stringify(response[1])){
                      ranges.push({
                      "spell-check": value,
                      anchor: { path, offset: elem.start_offset },
                      focus: { path, offset: elem.end_offset + 1 },
                    });
                    }
                  })
                }
              })
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

  //   ContentIntelligence.on('change', ({rte}:any) => {
  //     let test = []
  //     Array.from(spellResponse).forEach((response) =>{
  //       if(response && response[0]?.contentToReplace){
  //         Array.from(response[0]?.contentToReplace).forEach((elem) => {
  //           if(JSON.stringify(path) === JSON.stringify(response[1])){
  //             test.push({
  //             anchor: { path, offset: elem.start_offset },
  //             focus: { path, offset: elem.end_offset + 1 },
  //           });
  //           }
  //         })
  //       }
  //     })
  // })

    ContentIntelligence.on('keydown', async (props) => {
        const {rte, event} = props
        let path = rte._adv.Editor.path(rte._adv.editor, rte.selection.get())

        if (event.keyCode === 32) {
            if(rte?.CIFeatures[1].name === 'Spell Correction' && rte?.CIFeatures[1].isEnabled === false ){
                return
            }
            rte._adv.Editor.nodes(rte._adv.editor)
              let test = spellResponse.find((resp) => {
                return JSON.stringify(path) === JSON.stringify(resp?.[1])
              });
              if(test){
                test[0] = await getSpellSuggestion(
                  `${rte.getNode(rte.selection.get())[0].text}`
                )
              }
              if(test){
                spellResponse.filter((resp, index) => {
                  if(JSON.stringify(path) === JSON.stringify(resp?.[1])){
                    spellResponse.indexOf(resp)
                    spellResponse.splice(spellResponse.indexOf(resp), 1)
                  }
                })
                spellResponse.push(test)
              }
              else{
                spellResponse = [...spellResponse, [
                  await getSpellSuggestion(
                    `${rte.getNode(rte.selection.get())[0].text}`
                  ),
                  path
                ]]
              }
            if(spellResponse) rte.CIAppResponse['spellResponse'] = spellResponse
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