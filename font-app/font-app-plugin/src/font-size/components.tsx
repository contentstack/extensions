import React from "react";
import { Dropdown } from "@contentstack/venus-components";

import SIZES from "./size";

// Component to be rendered
export const FontSizeComponent = (props: any) => {
    const { leaf } = props;
    return (
        <span
            {...props.attrs}
            {...props.attributes}
            style={{ fontSize: leaf["font-size"] }}
        >
            {props.children}
        </span>
    );
};

// Icon to be rendered
const FontSizeIcon = () => {
    return (
        <svg
            width="14"
            height="15"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.8748 10L2.67491 7.53418H6.32036L7.1252 10H9L5.5818 0H3.41347L0 10H1.8748ZM3.14834 6.0791L4.45976 2.05078H4.53551L5.84692 6.0791H3.14834Z"
                fill="#647696"
            />
            <path
                d="M10.0416 10L10.4861 8.52051H12.5113L12.9584 10H14L12.101 4H10.8964L9 10H10.0416ZM10.7491 7.64746L11.4776 5.23047H11.5197L12.2483 7.64746H10.7491Z"
                fill="#647696"
            />
        </svg>
    );
};

const list = SIZES.map((size: number) => {
    return {
        label: <span>{size}</span>,
        value: size,
        showActive: true,
        action: () => {
            const { rte } = window;
            rte.addMark("font-size", size);
        },
    };
});

export function FontSizeDropdown() {
    return (
        <Dropdown
            className="full-button"
            list={list}
            type={"click"}
            highlightActive={true}
            closeAfterSelect={true}
        >
            <FontSizeIcon />
        </Dropdown>
    );
}
