import React from 'react'
import './style.scss'

export default function Tile({item, handleDoubleClick }) {
  const scaleIt = (item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) ? `scaleY(${item.mirrored})` : `scaleX(${item.mirrored})`

  const inlineStyle = {
    width: "100px",
    height: "100px",
    background: item.bg.substring(0,1) === "#" ? item.bg : `url(${item.bg})`,
    transform: `rotate(${item.orientation}) ${scaleIt}`
  };
    
  return (
    <div className={item.displayControlWidget ? `tile activeTile` : `tile`} style={inlineStyle} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
