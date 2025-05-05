import React, { useState } from 'react';
import { Dropdown } from '@contentstack/venus-components'
import { cx } from '@emotion/css'

import CI_Features, { CIFeatureName } from '../ciFeatures';
import { Icon } from '../../icons';
import { IAIRTEInstance, ICIFeatures } from '../types';

export const CIIcon: React.FC<{ rte: IAIRTEInstance }> = ({ rte }) => {
    const list = Object.keys(CI_Features).map((feature) => ({
        //@ts-ignore
        label: <CiList featureName={feature} rte={rte} />,
    }))
    return (
        <Dropdown list={list} type={'click'}>
            <Icon />
        </Dropdown>
    )
}

const CiList: React.FC<{ featureName: keyof ICIFeatures, rte: IAIRTEInstance }> = (props) => {
    const { featureName, rte } = props
    const [enabled, setEnabled] = useState<boolean>(rte.CIFeatures[featureName])
    const handleMouseDown = (_event: any) => {
        setEnabled(!enabled)
        rte.CIFeatures[featureName] = !enabled
    }
    return (
        <span
            data-testid="table-header-btn"
            className='table-header-btn'
            onMouseDown={handleMouseDown}
        >
            <span>{CIFeatureName[featureName]}</span>
            <span style={{ display: 'flex' }}>
                <Switch enabled={enabled} featureName={featureName} />
            </span>
        </span>
    )
}

const Switch: React.FC<{ enabled: boolean, featureName: string }> = (props) => {
    const { enabled, featureName } = props

    return (
        <div
            id={`ci_${featureName}`}
            data-testid="switch-toggle"
            className={cx('toggle-btn',
                { 'active': enabled }
            )}
        >
            <span
                className='round-btn'
            ></span>
        </div>
    )
}
export const CIComponent = (props: any) => {
    return <span {...props.attrs} {...props.attributes}>{props.children}</span>
}