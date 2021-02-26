import React from 'react'
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";


export default function RouterBtn(props) {
  return (

      <div>
        <Button color="primary" href={props.to}>
          {props.name}
        </Button>
      </div>

  )
}
