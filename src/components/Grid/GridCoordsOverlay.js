import React from 'react'
import GridLayout from 'react-grid-layout';

export default function GridCoordsOverlay(props) {
  const gridCellCoords = [
    { i: 'a', w: 1, h: 1, x: 0, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'b', w: 1, h: 1, x: 1, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'c', w: 1, h: 1, x: 2, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'd', w: 1, h: 1, x: 3, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'e', w: 1, h: 1, x: 4, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'f', w: 1, h: 1, x: 5, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'g', w: 1, h: 1, x: 6, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'h', w: 1, h: 1, x: 7, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'i', w: 1, h: 1, x: 8, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'j', w: 1, h: 1, x: 9, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'k', w: 1, h: 1, x: 10, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'l', w: 1, h: 1, x: 0, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'm', w: 1, h: 1, x: 0, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'n', w: 1, h: 1, x: 0, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'o', w: 1, h: 1, x: 0, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'p', w: 1, h: 1, x: 0, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'q', w: 1, h: 1, x: 0, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'r', w: 1, h: 1, x: 0, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 's', w: 1, h: 1, x: 0, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 't', w: 1, h: 1, x: 0, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'u', w: 1, h: 1, x: 0, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'v', w: 1, h: 1, x: 1, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'w', w: 1, h: 1, x: 1, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'x', w: 1, h: 1, x: 1, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'y', w: 1, h: 1, x: 1, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'z', w: 1, h: 1, x: 1, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aa', w: 1, h: 1, x: 1, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ab', w: 1, h: 1, x: 1, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ac', w: 1, h: 1, x: 1, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ad', w: 1, h: 1, x: 1, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'ae', w: 1, h: 1, x: 1, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'af', w: 1, h: 1, x: 2, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ag', w: 1, h: 1, x: 2, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ah', w: 1, h: 1, x: 2, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ai', w: 1, h: 1, x: 2, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aj', w: 1, h: 1, x: 2, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ak', w: 1, h: 1, x: 2, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'al', w: 1, h: 1, x: 2, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'am', w: 1, h: 1, x: 2, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'an', w: 1, h: 1, x: 2, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'ao', w: 1, h: 1, x: 2, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ap', w: 1, h: 1, x: 3, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aq', w: 1, h: 1, x: 3, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ar', w: 1, h: 1, x: 3, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'as', w: 1, h: 1, x: 3, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'at', w: 1, h: 1, x: 3, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'au', w: 1, h: 1, x: 3, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'av', w: 1, h: 1, x: 3, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aw', w: 1, h: 1, x: 3, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ax', w: 1, h: 1, x: 3, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'ao', w: 1, h: 1, x: 3, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ay', w: 1, h: 1, x: 4, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'az', w: 1, h: 1, x: 4, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ba', w: 1, h: 1, x: 4, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bb', w: 1, h: 1, x: 4, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bc', w: 1, h: 1, x: 4, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bd', w: 1, h: 1, x: 4, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'be', w: 1, h: 1, x: 4, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bf', w: 1, h: 1, x: 4, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bg', w: 1, h: 1, x: 4, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'bh', w: 1, h: 1, x: 4, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bi', w: 1, h: 1, x: 5, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bj', w: 1, h: 1, x: 5, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bk', w: 1, h: 1, x: 5, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bl', w: 1, h: 1, x: 5, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bm', w: 1, h: 1, x: 5, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bn', w: 1, h: 1, x: 5, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bo', w: 1, h: 1, x: 5, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bp', w: 1, h: 1, x: 5, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bq', w: 1, h: 1, x: 5, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'br', w: 1, h: 1, x: 5, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bs', w: 1, h: 1, x: 6, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bt', w: 1, h: 1, x: 6, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bu', w: 1, h: 1, x: 6, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bv', w: 1, h: 1, x: 6, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bw', w: 1, h: 1, x: 6, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bx', w: 1, h: 1, x: 6, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'by', w: 1, h: 1, x: 6, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'bz', w: 1, h: 1, x: 6, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ca', w: 1, h: 1, x: 6, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'cb', w: 1, h: 1, x: 6, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cc', w: 1, h: 1, x: 7, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cd', w: 1, h: 1, x: 7, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ce', w: 1, h: 1, x: 7, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cf', w: 1, h: 1, x: 7, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cg', w: 1, h: 1, x: 7, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ch', w: 1, h: 1, x: 7, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ci', w: 1, h: 1, x: 7, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cj', w: 1, h: 1, x: 7, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ck', w: 1, h: 1, x: 7, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'cl', w: 1, h: 1, x: 7, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cm', w: 1, h: 1, x: 8, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cn', w: 1, h: 1, x: 8, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'co', w: 1, h: 1, x: 8, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cp', w: 1, h: 1, x: 8, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cq', w: 1, h: 1, x: 8, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cr', w: 1, h: 1, x: 8, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cs', w: 1, h: 1, x: 8, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ct', w: 1, h: 1, x: 8, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cu', w: 1, h: 1, x: 8, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'cv', w: 1, h: 1, x: 8, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cw', w: 1, h: 1, x: 9, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cx', w: 1, h: 1, x: 9, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cy', w: 1, h: 1, x: 9, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'cz', w: 1, h: 1, x: 9, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'da', w: 1, h: 1, x: 9, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'db', w: 1, h: 1, x: 9, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'dc', w: 1, h: 1, x: 9, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'dd', w: 1, h: 1, x: 9, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'de', w: 1, h: 1, x: 9, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'df', w: 1, h: 1, x: 9, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
  ]
  // doesn't work because of z-index shenanigans
  const handleOnCoordClick = (e) => {
    console.log(e)
  }

  return (
    !props.viewState ? 
    (<GridLayout
      className="mapCoordsGrid"
      {...props}
      compactType={null}
      margin={[0,0]}
      isDraggable={false}
      isDroppable={false}
      isResizable={false}
      style={{height: "100%"}}
    >
      {gridCellCoords.map( cell => <div key={cell.i} className="grid-cell-coords" data-grid={{...cell}} resizable="false" onClick={(e) => handleOnCoordClick(e)}>{cell.x},{cell.y}</div> )} 
    </GridLayout>)
    :
    null
  )
}
