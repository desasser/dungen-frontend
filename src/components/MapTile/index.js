import React from 'react'
import { Group, Image, Path } from 'react-konva'
import { animated } from 'react-spring/renderprops-konva'
import useImage from 'use-image'

export default function CanvasTile(props) {
  const [image] = useImage(`${props.image_src}`, 'Anonymous');
  
  return (
    <Group
      id={props.id}
      className="tile-image-group"
      x={props.x}
      y={props.y}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragMove={props.onDragMove}
      onDragEnd={props.onDragEnd}
      offset={{x: -(props.width / 2), y: -(props.height / 2)}}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <Image
        className="tile-image"
        image={image}
        width={props.width}
        height={props.height}
        rotation={props.rotation}
        scale={props.scale}
        offset={{x: props.width / 2, y: props.height / 2}}
      />
    </Group>
  )
}
