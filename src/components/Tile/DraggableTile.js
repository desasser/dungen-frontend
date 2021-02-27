import React from "react";
import './style.scss'

export default function DraggableTile({ tileId, children, imageURL, handleOnClick }) {
  const handleDraggableDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "");
  }

  return (
    <div
      className="droppable-element"
      data-tileid={tileId}
      data-image={imageURL}
      draggable={true}
      unselectable="on"
      style={{background: `url(${imageURL})`}}
      // Firefox hack
      onDragStart={handleOnClick}
    >
      {children}
    </div>
  );
}
