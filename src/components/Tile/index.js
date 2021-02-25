import { useState, useEffect } from 'react'
import SVG from './SVG'
import Rectangle from './Rectangle'

export default function Tile(props) {
  const color = props.color !== undefined ? props.color : "#000";

let placeholderStyle = {
  width: 100,
  height: 100,
  backgroundColor: 'tomato',
  margin:25
}

// export default function Tile() {
  return (
    <div style={placeholderStyle}>
     </div> 
  //  return (
  //   <div>
  //     <SVG title="square" desc="a tile" width="100%" height="100%" minX={50} minY={50} style={{display: "block"}}>
  //       <Rectangle width="100" height="100" fill={color} x={0} y={0} />
  //     </SVG>
  //   </div>
  // )
  )}
