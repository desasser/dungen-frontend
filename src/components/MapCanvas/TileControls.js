import React from 'react'
import './control-styles.scss'
// import { Group, Rect, Text, Ring, Circle } from 'react-konva'

export default function TileControls(props) {
  return (
    <div id={props.id} className="tile-controls">
      <button>RL</button>
      <button>RR</button>
    </div>

    // <Group className='tileControls' visible={props.visible}>
    //   <Rect fill="white" stroke="dimgrey" strokeWidth={0.25} x={5} y={0} width={90} height={25} />
    //   <Text text="Rotate Left" fill="black" x={20} y={8} />
    // </Group>
  )
}
