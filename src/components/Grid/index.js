import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.css'
import Tile from '../Tile';
 
export default function Grid() {
    // layout is an array of objects, see the demo for more complete usage
    // const layout = [
    //   {i: 'a', x: 0, y: 0, w: 1, h: 2},
    //   {i: 'b', x: 1, y: 0, w: 1, h: 2},
    //   {i: 'c', x: 2, y: 0, w: 1, h: 2}
    // ];

    return (
      <GridLayout className="layout" colWidth={100} rowHeight={100}  width={1200} compactType={null} preventCollision={true} margin={[0,0]} style={{backgroundColor: "gainsboro"}}>
        <div key="a" data-grid={{x: 0, y: 0, w: 1, h: 1}}><Tile color="tomato" /></div>
        <div key="b" data-grid={{x: 1, y: 0, w: 1, h: 1}}><Tile color="dodgerblue" /></div>
        <div key="c" data-grid={{x: 2, y: 0, w: 1, h: 1}}><Tile color="hotpink" /></div>
      </GridLayout>
    )
}
