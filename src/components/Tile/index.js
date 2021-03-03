import React from 'react'
import './style.scss'

export default function Tile({item, handleDoubleClick }) {
  const [inlineStyles, setInlineStyles] = React.useState({
    background: "#f00",
    transform: `rotate(${item.orientation}deg) scale(1,1)`,
    backgroundSize: "contain",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat"
  })

  React.useEffect(() => {
    console.log("TILE", item.orientation);
    let scale = "scale(1,1)";
    if(item.mirror !== undefined && item.mirror !== null) {
      scale = (item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) ? `scaleY(${item.mirror})` : `scaleX(${item.mirror})`;
    }

    let newStyles = {
      ...inlineStyles,
      transform: `rotate(${item.orientation}deg) ${scale}`
    }

    if(item.bg.substring(0,1) === "#") {
      newStyles.backgroundColor = item.bg;
    } else {
      newStyles.backgroundImage = `url(${item.bg})`;
    }

    setInlineStyles({...newStyles})

  }, [item.orientation, item.mirror]);
    
  return (
    <div className={item.displayControlWidget ? `tile activeTile` : `tile`} style={inlineStyles} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
