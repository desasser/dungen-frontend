import React from 'react'
import Button from '@material-ui/core/Button';

export default function ActionBtn(props) {
  const args = {...props};
  if(args.name !== undefined) { delete args.name }
  if(args.children !== undefined) { delete args.children }
  if(args.classes !== undefined) { delete args.classes }

  return (
    <Button variant="contained" {...args} className={props.classes}>{props.name !== undefined ? props.name : props.children}</Button>
  )
}
