import { useState, useEffect } from 'react'
import SVG from './SVG'
import Rectangle from './Rectangle'

export default function Tile({ color, width, height }) {
  if(color === undefined) { color = "#000" }
  if(width === undefined) { width = "100" }
  if(height === undefined) { height = "100" }

  return (
    <div>
      <SVG title="square" desc="a tile" width="100%" height="100%" minX={50} minY={50} style={{display: "block"}}>
        <Rectangle width={width} height={width} fill={color} x={0} y={0} />
      </SVG>
    </div>
  )
}
