import React from 'react'
import { Group, Image } from 'react-konva'
import useImage from 'use-image'

export default function Tile(props) {
  const [image] = useImage(`${props.image_src}`);
  // console.log(props);

  return (
    <Image
      className="tile-image"
      id={props.imgKey}
      name={props.imgKey}
      draggable={props.draggable}
      x={props.x}
      y={props.y}
      image={image}
      width={props.width}
      height={props.height}
      rotation={props.rotation}
      scale={props.scale}
      // offsetX={image ? image.width / 2 : 0}
      // offsetY={image ? image.height / 2 : 0}
      style={{border: "none"}}
      onDragStart={props.onDragStart}
      onDragMove={props.onDragMove}
      onDragEnd={props.onDragEnd}
    />
  )
}
