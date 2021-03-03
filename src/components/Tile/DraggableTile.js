import React from "react";
import Container from '@material-ui/core/Container';
import './style.scss'

export default function DraggableTile({ tileId, children, imageURL, handleOnDragStart }) {

  // const handleDraggableDragStart = (e) => {
  //   e.dataTransfer.setData("text/plain", "");
  // }

  return (
    <div
      className="droppable-element"
      data-tileid={tileId}
      data-maptileid={null}
      data-environment="swamp"
      data-image={imageURL}
      draggable={true}
      unselectable="on"
      style={{background: `url(${imageURL})`, borderRight: "8px solid #1e3a42", borderBottom: "8px solid #1e3a42", borderTop: "8px solid #8eb1c7", borderLeft: "8px solid #8eb1c7"}}
      // Firefox hack
      onDragStart={handleOnDragStart}
    >
      {children}
    </div>
  );
}
