import { useState, useEffect } from 'react';
import SVG from './SVG';
import Rectangle from './Rectangle';
import Container from '@material-ui/core/Container';

export default function Tile(props) {
  const color = props.color !== undefined ? props.color : "#000";

  // export default function Tile() {
  return (
      <img src={props.image} alt='a tile' style={{height:100,width:100,margin:25}}/>
    //  return (
    //   <div>
    //     <SVG title="square" desc="a tile" width="100%" height="100%" minX={50} minY={50} style={{display: "block"}}>
    //       <Rectangle width="100" height="100" fill={color} x={0} y={0} />
    //     </SVG>
    //   </div>
    // )
  )
}
