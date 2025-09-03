import React from 'react'
import styles from '../style.module.css'
import TableElement from './TableElement'
import ChevronIcon from './Icons/Chevron'
import { useState } from 'react'

const Table = ({fonts, deleteFont} : {fonts: any, deleteFont: any}) =>{
    const [toggle, setToggle] = useState(true)
    const handleToggle = () => {
      setToggle(!toggle)
    }
    return ( 
    <div className={styles["table"]}>
    <div className={styles["child1"]}>
      <div className={styles["subChild"]}>
        <span className={styles["name"]}>Name</span>
        <span className={styles["chevronIcon"]}>
          <ChevronIcon onClick={handleToggle}/>
        </span>
      </div>
      <div className={styles["subChild"]}>
        <span className={styles["url"]}>URL</span>
      </div>
    </div>
      {
        toggle && <TableElement fonts={fonts} deleteFont={deleteFont}/>
      }
  </div>)
}
export default Table