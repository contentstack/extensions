import React from "react";
import { cbModal } from "@contentstack/venus-components";
import AudienceModal from "./AudienceModal";
import { isPrePostTagsPresent } from "./lib";
import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";

import "./style.css";

export const AudiencePreTag = (props) => {
    const {
        attributes,
        attrs,
        children,
        audienceList,
        savedSelection,
        rte,
        invalidConfig
    } = props;

    const handleMouseDown = (event) => {
        if (event) event.preventDefault();
        cbModal({
            component: (modalProps) => (
                <AudienceModal
                    audiences={audienceList}
                    savedSelection={savedSelection}
                    rte={rte}
                    attrs={attrs}
                    {...props}
                    {...modalProps}
                    invalidConfig={invalidConfig}
                />
            ),

            modalProps: {
                //@ts-ignore
                shouldReturnFocusAfterClose: false,
                customClass: "variable-extension-modal",
            },
        });
    };

    return (
        <span
            onMouseDown={handleMouseDown}
            {...attributes}
            className="audience-plugin audience-pre"
            data-attrs={JSON.stringify(attrs)}
            contentEditable={true}
            style={{ userSelect: "none", margin: "0 2px" }}
            data-type="audience-pre"
        >
            {`[Audience = ${attrs?.audiences?.join(", ")} ]`}
            {children}
        </span>
    );
};

export const AudiencePostTag = (props) => {
    const { attributes, attrs, children } = props;

    return (
        <span
            {...attributes}
            className="audience-plugin audience-post"
            data-type="audience-post"
            data-attrs={JSON.stringify(attrs)}
            contentEditable={true}
            style={{ userSelect: "none", margin: "0 3px" }}
        >
            {"[AudienceEnd]"}
            {children}
        </span>
    );
};

export const AudienceWrapperComponent = (props: { attributes: any; attrs: any, children: any, element: any, rte: IRteParam }) => {
    const { attributes, attrs, children, element, rte } = props;
    const isWrapperTagsPresent = isPrePostTagsPresent(element.children);
    const childNode = []

    if (!isWrapperTagsPresent) {
        element.children.forEach((node) => {
            if (node.type === "audience-pre" || node.type === "audience-post") {
                rte.removeNode(node);
            }
            childNode.push(node)
        })
    }

    return isWrapperTagsPresent ? <span
        {...attributes}
        className="audience-plugin audience-wrapper"
        data-type="audience-wrapper"
        data-attrs={JSON.stringify(attrs)}
        contentEditable={true}
        style={{ userSelect: "none", margin: "0 3px" }}
    >
        {children}
    </span> : <>{children}</>
};