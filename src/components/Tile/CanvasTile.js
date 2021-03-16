import React from 'react'
import { Group, Image, Path } from 'react-konva'
import { animated } from 'react-spring/renderprops-konva'
import useImage from 'use-image'

export default function CanvasTile(props) {
  const [image] = useImage(`${props.image_src}`, 'Anonymous');
  const args = {...props}
  delete args.image_src

  return (
    <Group stroke={args.stroke} strokeWidth={0.5}>
      <animated.Path
        data="M 0 0 H 100 V 100 H 0 L 0 0"
        x={args.x}
        y={args.y}
        strokeDasharray={args.width * 2 + args.length * 2}
        strokeDashoffset={args.dash}
      />
      <Image
        className="tile-image"
        {...args}
        image={image}
      />
    </Group>
    // <Spring>
      
    // </Spring>
    // <Image
    //   className="tile-image"
    //   id={props.id}
    //   name={props.imgKey}
    //   draggable={props.draggable}
    //   x={props.x}
    //   y={props.y}
    //   image={image}
    //   width={props.width}
    //   height={props.height}
    //   rotation={props.rotation}
    //   scale={props.scale}
    //   // offsetX={image ? image.width / 2 : 0}
    //   // offsetY={image ? image.height / 2 : 0}
    //   style={{border: "1px solid red", width: props.width, height: props.height, backgroundColor: "pink", zIndex: 100}}
    //   onDragStart={props.onDragStart}
    //   onDragMove={props.onDragMove}
    //   onDragEnd={props.onDragEnd}
    //   onDragOver={props.onDragOver}
    // />
  )
}
