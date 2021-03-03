import React from 'react'
import Button from '@material-ui/core/Button';

export default function ActionBtn(props) {
  return (
    <Button variant="contained" onClick={props.action} className={props.classes}>{props.name}</Button>
  )
}
