import React, {useState} from 'react'
import Tippy from "@tippyjs/react";
import GrammarCheckTooltip from './GrammarCheckTooltip';

const GrammarComponent = (props: any, handleClick: any) => {
    const [visible, setVisible] = useState(false)
    return (
        <span className="tippy-inline">
            <Tippy
                appendTo={document.body}
                className="p-0"
                placement='bottom-start'
                trigger="click"
                visible={visible}
                interactive={true}
                onClickOutside={() => setVisible(false)}
                content={
                    <GrammarCheckTooltip {...props} handleClick={props.handleClick} setVisible={setVisible}/>
                }
            >
            <span style={{borderBottom: '2px solid #FFAE0A', background: '#FFF8EB'}} onClick={() => setVisible(true)}>{props.children}</span>
            </Tippy>
        </span>
    );
};

export default GrammarComponent;