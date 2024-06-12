import React from "react";
//@ts-ignore
import "./style.css";

const SpellCheckTooltip = (props: any, handleClick: any) => {
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
        correctOptionsArray.map((spelling: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => {
          return(
            <div className="spell-suggestions-wrapper">
            <span className="spell-suggestions"
              onClick={() => {
                props.setVisible(false)
                props.handleClick(spelling)
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
