import React from 'react'
import './style.scss'

export default function Tile({item, handleDoubleClick }) {
  let scaleIt = (item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) ? `scaleY(${item.mirrored})` : `scaleX(${item.mirrored})`

  const inlineStyles = {
    background: item.bg.substring(0,1) === "#" ? item.bg : `url(${item.bg})`,
    transform: `rotate(${item.orientation}deg) ${scaleIt}`
  }

  // React.useEffect(() => {
  //   console.log(item);
  // }, []);
    
  return (
    <div className={item.displayControlWidget ? `tile activeTile` : `tile`} style={{...inlineStyles}} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
