import { useState, useEffect } from "react";
import './style.scss'

export default function Tile({item, handleDoubleClick, handleWidgetButtonClick}) {

  let tileStyles = {
    width: 100,
    height: 100,
    backgroundColor: `${item.bg}`,
    transform: `rotate(${item.orientation}deg)`
  }

  // useEffect(() => {
  //   console.log(item);
  // },[]);

  

  // export default function Tile() {
  return (
    <div className="tile" style={tileStyles} onDoubleClick={(e) => handleDoubleClick(e)}>
      
    </div>
  );
}
