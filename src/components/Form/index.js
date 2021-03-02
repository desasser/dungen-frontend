import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import React from 'react'



export default function Form(props) {
  // console.log(`this is history`,  props.history )
  return (
    <>
      <form onSubmit={props.handleSubmit} noValidate autoComplete="off">
        <div>
          <TextField id="standard-basic" type="text" label="userName" name="userName" value={props.userName} onChange={props.handleInputChange} />
        </div>
        <div>
          <TextField id="standard-basic" type="text" label="Name" name="name" value={props.name} onChange={props.handleInputChange} />
        </div>
        <div>
          <TextField id="standard-basic" type="password" label="Password" name="password" value={props.password} onChange={props.handleInputChange} />
        </div>
        <Button type="submit" color="primary" variant="contained" onClick={props.handleSubmit}>
          Get 'er Dun(..gen) Why is this in all caps?
          </Button>
      </form>
    </>
  )


}