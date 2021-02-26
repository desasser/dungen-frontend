import { useState, useEffect } from "react";
// import SVG from "./SVG";
// import Rectangle from "./Rectangle";

export default function Tile({item}) {

  let placeholderStyle = {
    width: 100,
    height: 100,
    backgroundColor: 'tomato',
    margin: 25
  }

  // export default function Tile() {
  return (
<<<<<<< HEAD
    <div data-tileid={item.i} data-environment={item.environment} data-orientation={item.orientation} style={{ transform: `rotate(${item.orientation}deg)`, backgroundColor: `${item.bg}`}} >
      <span className="tileName">{item.i}</span>
      <span className="top">(0deg)</span>
      <span className="right">(90deg)</span>
      <span className="bottom">(180deg)</span>
      <span className="left">(270deg)</span>
    </div>
  );
=======
    <div style={placeholderStyle}>
    </div>
    //  return (
    //   <div>
    //     <SVG title="square" desc="a tile" width="100%" height="100%" minX={50} minY={50} style={{display: "block"}}>
    //       <Rectangle width="100" height="100" fill={color} x={0} y={0} />
    //     </SVG>
    //   </div>
    // )
  )
>>>>>>> dev
}
