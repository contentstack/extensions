import React from "react";
//@ts-ignore
import styles from "./style.module.css";
import "./style.css";

const GrammerCheckTooltip = (props: any, handleClick: any) => {
  return (
    <div className="tooltip-wrapper">
      <div className="grammar-wrapper">
        Grammer
      </div>
      <div className="grammar-text">
        Use "{props.leaf["grammar-check"].corrected_input}" instead of "
        {props.leaf["grammar-check"].incorrect_input}".
      </div>
      <div className="grammar-suggestion-wrapper">
        <span className="grammar-suggestions"
          onClick={props.handleClick}
        >
          {props.leaf["grammar-check"].corrected_input}
        </span>
      </div>
    </div>
  );
};

export default GrammerCheckTooltip;
