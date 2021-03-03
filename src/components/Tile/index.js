import React from 'react'
import './style.scss'

export default function Tile({item, handleDoubleClick }) {
  const [inlineStyles, setInlineStyles] = React.useState({
    background: "#f00",
    transform: `rotate(0deg) scale(1,1)`
  })

  React.useEffect(() => {
    let scale = "scale(1,1)";
    if(item.mirror !== undefined && item.mirror !== null) {
      scale = (item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) ? `scaleY(${item.mirror})` : `scaleX(${item.mirror})`;
    }

    setInlineStyles({
      background: item.bg.substring(0,1) === "#" ? item.bg : `url(${item.bg})`,
      transform: `rotate(${item.orientation}deg) ${scale}`
    });

  }, [item.mirror, item.orientation])

  // React.useEffect(() => {
  //   SetOrientation(item.orientation);
    
  // }, [item.orientation]);

  // React.useEffect(() => {
  //   if(item.mirror !== undefined && item.mirror !== null) {
  //     let scale = (item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) ? `scaleY(${item.mirror})` : `scaleX(${item.mirror})`;
  //     setScaleIt(scale);

  //   }
  // }, [item]);
    
  return (
    <div className={item.displayControlWidget ? `tile activeTile` : `tile`} style={{...inlineStyles}} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
