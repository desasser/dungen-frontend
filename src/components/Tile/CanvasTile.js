import React from 'react'
import { Group, Image } from 'react-konva'
import useImage from 'use-image'

export default function CanvasTile(props) {
  const [image] = useImage(`${props.image_src}`, 'Anonymous');
  // console.log(props);

  return (
    <Image
      className="tile-image"
      id={props.id}
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
      style={{border: "1px solid red", width: props.width, height: props.height, backgroundColor: "pink", zIndex: 100}}
      onDragStart={props.onDragStart}
      onDragMove={props.onDragMove}
      onDragEnd={props.onDragEnd}
      onDragOver={props.onDragOver}
    />
  )
}
