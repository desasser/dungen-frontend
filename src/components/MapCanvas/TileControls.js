import React from 'react'

export default function TileControls(props) {
  return (
    <div id={props.id} className={props.classes}>
      <button>RL</button>
      <button>RR</button>
    </div>
  )
}
