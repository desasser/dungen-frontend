import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Alert from '../AlertBar'




export default function Form(props) {
  // console.log(`this is history`,  props.history )
useEffect(() => {
  console.log(props)
  console.log(props.login)
}, [])
  return (
    <>
      <form onSubmit={props.handleSubmit} noValidate autoComplete="off">
        <div>
          <Alert error = {props.error}></Alert>
          <TextField id="standard-basic" type="text" label="userName"  name="userName" required value={props.userName} onChange={props.handleInputChange} />
        </div>
        {!props.login ? <span>
        <div>
          <TextField id="standard-basic" type="text" label="Email" name="email" required value={props.name} onChange={props.handleInputChange} />
        </div> 
        </span> : null}
        {!props.login ? <span>
        <div>
          <TextField id="standard-basic" type="text" label="Name" name="Name" value={props.name} onChange={props.handleInputChange} />
        </div> 
        </span> : null}
        <div>
          <TextField id="standard-basic" type="password" label="Password" name="password" required value={props.email} onChange={props.handleInputChange} 
          />
        </div>
        {/* {!props.login ? <span>
        <div>
          <TextField id="standard-basic" type="password" label="Verify Password" name="password" value={props.password} onChange={props.handleInputChange} />
        </div> 
        </span> : null} */}
        <Button type="submit" color="primary" variant="contained" onClick={props.handleSubmit}>
          Submit
          </Button>
      </form>
    </>
  )


}