import React from 'react'
import Button from '@material-ui/core/Button';



export default function RouterBtn(props) {
  return (
    <Button href={props.to} className={props.classes} variant={props.variant}>
      {props.name}
    </Button>
  )
}
