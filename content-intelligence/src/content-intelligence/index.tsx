//@ts-nocheck
import React, {useState} from 'react';
import {Dropdown, Switch } from '@contentstack/venus-components'
import CI_Features from './ciFeatures';
import { Icon } from '../icons';
//@ts-ignore
import './style.css'
import {cx} from '@emotion/css'

const CIComponent = (props:any) => {
    return <span {...props.attrs} {...props.attributes}>{props.children}</span>
}

export const contentIntelligenceIcon = (RTE:any) => {
    const ContentIntelligence = RTE('content-intelligence', (rte: any) => {
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