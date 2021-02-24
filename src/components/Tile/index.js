import { useState, useEffect } from 'react'
import SVG from './SVG'
import Rectangle from './Rectangle'
// import Moveable from 'react-moveable'

export default function Tile(props) {
  return (
    <SVG title="square" height="100" width="100">
      <Rectangle height="50" width="50" x="25" y="25" />
    </SVG>
  )
}
