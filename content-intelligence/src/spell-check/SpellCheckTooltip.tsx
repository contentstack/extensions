import React from "react";
//@ts-ignore
import "./style.css";

const SpellCheckTooltip = (props: any) => {
  const correctOptionsSet: Set<string> = props?.leaf?.['spell-check'] || new Set()
  const correctOptionsArray = Array.from(correctOptionsSet)
  return (
    <div className="spell-wrapper">
      <div className="spelling-mistake">
        Spelling mistake
      </div>
      <div className="spell-mistake-text">
       Possible spelling mistake found.
      </div>
      <div style={{display: "flex"}}>
      {
        correctOptionsArray.map((spelling) => {
          return(
            <div className="spell-suggestions-wrapper" key={spelling}>
            <span className="spell-suggestions"
              onClick={() => {
                props.setVisible(false)
                props.handleClick(props.leaf.text, spelling)
              }}
            >
              {spelling}
            </span>
          </div>
          )
        })
      }
      </div>
    </div>
  );
};

export default SpellCheckTooltip;
