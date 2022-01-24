import React from 'react'
import { Icon } from '@contentstack/venus-components'
import ContentstackSDK from "@contentstack/app-sdk";

import './styles.css'

export default ContentstackSDK.init().then(async (sdk) => {
    const extensionObj = await sdk["location"];
    const RTE = await extensionObj["RTEPlugin"];
    if(!RTE) return ;

    const Highlight = RTE('highlight', () => ({
        title: 'Highlight',
        icon: <Icon className='pr-6' icon="Edit" size="original" />,
        render: (props:any) => {
            return <span className='highlight'>{props.children}</span>
        },
        display: ['toolbar'],
        elementType: ['text']
    }));
    
    return {
        Highlight
    };
});
