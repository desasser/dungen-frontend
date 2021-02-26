import React from 'react'
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";


export default function RouterBtn(props) {
  return (
    <Button href={props.to} className={props.classes}>
      {props.name}
    </Button>
  )
}
