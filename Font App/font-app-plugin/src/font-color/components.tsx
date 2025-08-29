import React from "react";
import ColorPicker from "./colorpicker";

export const ColorComponent = (props: any) => {
    const { leaf } = props;
    return (
        <span
            {...props.attrs}
            {...props.attributes}
            style={{ color: leaf["font-color"] }}
        >
            {props.children}
        </span>
    );
};

export function FCIcon() {
    return (
        <ColorPicker
            onChange={(value: string) => {
                const { rte } = window;
                rte.addMark("font-color", value);
            }}
        />
    );
}
