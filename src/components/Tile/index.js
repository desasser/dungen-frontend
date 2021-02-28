import { useState, useEffect } from 'react';
import SVG from './SVG';
import Rectangle from './Rectangle';
import Container from '@material-ui/core/Container';
import './style.scss'

export default function Tile({item, handleDoubleClick}) {

  let scaleIt = `scaleX(${item.mirrored})`;
  if(item.orientation == 90 || item.orientation == -90 || item.orientation == 270 || item.orientation == -270) {
    scaleIt = `scaleY(${item.mirrored})`;
  }

  // export default function Tile() {
  // return (
      // <img src={props.image} alt='a tile' style={{height:100,width:100,margin:25}}/>
    //  return (
    //   <div>
    //     <SVG title="square" desc="a tile" width="100%" height="100%" minX={50} minY={50} style={{display: "block"}}>
    //       <Rectangle width="100" height="100" fill={color} x={0} y={0} />
    //     </SVG>
    //   </div>
    // )
  // )
  // let tileStyles = {
  //   width: 100,
  //   height: 100,
  //   backgroundColor: `${item.bg}`,
  //   transform: `rotate(${item.orientation}deg)`
  // }
  
  // // export default function Tile() {
  // return (
  //   <div className="tile" style={tileStyles} onDoubleClick={(e) => handleDoubleClick(e)}>
      
  //   </div>
  // );
  let tileStyles = {
    width: 100,
    height: 100,
    background: item.bg.substring(0,1) === "#" ? item.bg : `url(${item.bg})`,
    transform: `rotate(${item.orientation}deg) ${scaleIt}`
  }

  // useEffect(() => {
  //   console.log(item);
  // },[]);

  // export default function Tile() {
  return (
    <div className={item.displayControlWidget ? "tile activeTile" : "tile"} style={tileStyles} onDoubleClick={(e) => handleDoubleClick(e)}></div>
  );
}
