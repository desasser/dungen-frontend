import React from "react";

export default function DraggableTile({itemKey, tile, environment, orientation, children}) {
  const handleDraggableDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "");
  }

  return (
    <div
      className="droppable-element"
      key={itemKey}
      data-tile={tile}
      data-environment={environment}
      data-orientation={orientation}
      draggable={true}
      unselectable="on"
      // Firefox hack
      onDragStart={(e) => handleDraggableDragStart(e)}
    >
      {children}
    </div>
  );
}
