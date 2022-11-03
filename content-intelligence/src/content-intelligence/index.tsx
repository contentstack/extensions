//@ts-nocheck
import React, {useState} from 'react';
import {Dropdown, Switch } from '@contentstack/venus-components'
import CI_Features from './ciFeatures';
import { Icon } from '../icons';
//@ts-ignore
import styles from './style.module.css'

const CIComponent = (props:any) => {
    return <span {...props.attrs} {...props.attributes}>{props.children}</span>
}

export const contentIntelligenceIcon = (RTE:any) => {
    // console.log("RTE", RTE) 
    const ContentIntelligence = RTE('content-intelligence', () => ({
        title: 'Content Intelligence',
        icon: <CIIcon/>,
        render: (props) => { console.log('props::', props); return <CIComponent {...props} />},
        display: ['toolbar']
    }));

    ContentIntelligence.on('exec', (rte:any) => {
        if(!window.rte) {
            window.rte = rte;
        }
        console.log("icon clicked")
    })

    return ContentIntelligence;
}

const handleCheckbox = () => {

}

const handleMouseDown = () => {
    
}
const list = CI_Features.map((feature) => ({
    label:  <span
    data-testid="table-header-btn"
    // className={cx(styles['table-header-btn'], {
    //   [styles['table-header-btn--disable']]: isTableDisable
    // })}
    // onMouseDown={handleMouseDown}
    >
    <span>{feature['name']}</span>
    <span style={{ display: 'flex' }}>
      <Switch onChange={handleCheckbox} checked={true} />
    </span>
  </span>,
    // value: feature['color'],
    // showAsActive: true,
    // action: () => {
    //     // const {rte} = window;
    //     // rte.addMark('font-color', _['color']);
    // }
}))

function CIIcon() {
    return (
        <Dropdown list={list} type={'click'} highlightActive={true}>
            <Icon/>
        </Dropdown>
    )
}

function Switch (props) {
  const { disabled = false, onChange: propsOnChange = () => { }, checked: propsChecked = false } = props

  const [checked, setOnChange] = useState(propsChecked)

  function handleMouseDown(event: React.MouseEvent) {

    event.preventDefault()
    if (disabled) return
    setOnChange((prevProps) => !prevProps)
    propsOnChange(event)
  }

  return (
    <div
      data-testid="switch-toggle"
    //   className={cx(
    //     styles['toggle-btn'],
    //     { [styles['active']]: !disabled && checked },
    //     { [styles['disabled']]: disabled }
    //   )}
      onMouseDown={handleMouseDown}>
      <span className={styles['round-btn']}></span>
    </div>
  )
}