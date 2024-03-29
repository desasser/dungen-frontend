import React from 'react'
import Button from '@material-ui/core/Button';
import { purple, pink, lightGreen, lime, deepOrange } from '@material-ui/core/colors';

export default function ActionBtn(props) {
  const args = {...props};
  if(args.name !== undefined) { delete args.name }
  if(args.children !== undefined) { delete args.children }
  if(args.classes !== undefined) { delete args.classes }
  if(props.action !== undefined) { args.onClick = props.action; delete args.action; }
  // console.log(args);

  return (
    <Button variant="contained" {...args} className={props.classes}>{props.name !== undefined ? props.name : props.children}</Button>
  )
}
