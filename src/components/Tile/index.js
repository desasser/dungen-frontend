import { useState, useEffect } from "react";
import './style.scss'

export default function Tile({item, handleDoubleClick}) {

  let tileStyles = {
    width: 100,
    height: 100,
    background: item.bg.substring(0,1) === "#" ? item.bg : `url(${item.bg})`,
    transform: `rotate(${item.orientation}deg)`
  }

  // useEffect(() => {
  //   console.log(item);
  // },[]);

  // export default function Tile() {
  return (
    <div className={item.displayControlWidget ? "tile activeTile" : "tile"} style={tileStyles} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
