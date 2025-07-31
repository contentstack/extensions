import React, { useState } from "react";
import styles from "../style.module.css";
import DeleteIcon from "./Icons/Delete";

const TableElement = ({ fonts, deleteFont }: { fonts: any, deleteFont: any }) => {
  return fonts.map((font: any, index: number) => (
    <div className={styles["child2"]} key={index}>
      <div className={styles["subChild"]}>
        <span className={styles["roboto"]}>{font.name}</span>
      </div>
      <div className={styles["subChild"]}>
        <span className={styles["roboto-url"]}>
          {font.url}
        </span>
      </div>
      <div 
        className={styles["subChild"]}
        style={{ justifyContent: "flex-end" }}
      >
        <span 
          className={styles["delete"]} 
          onClick={() => deleteFont(font)}
          style={{ cursor: "pointer" }}
          title={`Delete ${font.name}`}
        >
          <span className={styles["deleteSVG"]}>
            <DeleteIcon/>
          </span>
        </span>
      </div>
    </div>
  ));
};

export default TableElement;
