import { useState, useEffect } from "react";
// import SVG from "./SVG";
// import Rectangle from "./Rectangle";

export default function Tile({item}) {

  let placeholderStyle = {
    width: 100,
    height: 100,
    backgroundColor: `${item.bg}`,
    transform: `rotate(${item.orientation}deg)`,

  }

  // export default function Tile() {
  return (
    <div data-tileid={item.i} data-environment={item.environment} data-orientation={item.orientation} style={placeholderStyle} >
      <span className="tileName">{item.i}</span>
      <span className="top">(0deg)</span>
      <span className="right">(90deg)</span>
      <span className="bottom">(180deg)</span>
      <span className="left">(270deg)</span>
    </div>
  );
}
