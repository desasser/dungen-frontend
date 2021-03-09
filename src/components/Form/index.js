import React, { useState, useEffect } from 'react';
import { makeStyles, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Alert from '../AlertBar'

const useStyles = makeStyles(() => ({
  submitBtn: {
    '&:hover' : {
      color: 'white',
      backgroundColor: '#eb4511'
    },
    width: 100,
    height: 40,
    backgroundColor: 'white',
    color: '#eb4511',
    fontSize: '18px',
    fontFamily: 'SpaceAndAstronomy',
  },
}))


export default function Form(props) {
useEffect(() => {
  console.log(props)
  console.log(props.login)
}, [])

const classes = useStyles();

  return (
    <>
      <form onSubmit={(event) => props.handleSubmit(event.target.value)} onChange={props.handleInputChange} credentials={props.credentials} noValidate autoComplete="off">
        <div>
          <Alert error = {props.error}></Alert>
          <TextField id="standard-basic" type="text" label="username"  
          name="userName" required 
          value={props.userName} 
          onSubmit={(event) => props.handleSubmit(event.target.value)} 
          onChange={props.handleInputChange} 
          credentials={props.credentials} 
          labelClassName={classes.fieldText}/>
        </div>
        {!props.login ? <span>
        <div>
          <TextField id="standard-basic" type="text" label="email" name="email" required value={props.name} onChange={props.handleInputChange} labelClassName={classes.fieldText}/>
        </div> 
        </span> : null}
        {!props.login ? <span>
        <div>
          <TextField id="standard-basic" type="text" label="name" name="Name" 
          value={props.name} 
          onChange={props.handleInputChange} 
          labelClassName={classes.fieldText}/>
        </div> 
        </span> : null}
        <div>
          <TextField id="standard-basic" type="password" label="password" 
          name="password" required 
          value={props.email} 
          onSubmit={(event) => props.handleSubmit(event.target.value)} 
          onChange={props.handleInputChange} 
          credentials={props.credentials} 
          labelClassName={classes.fieldText}
          />
        </div>
        <Button type="submit" color="primary" variant="contained" onClick={props.handleSubmit} style={{marginTop:15}} className={classes.submitBtn}>
          Submit
          </Button>
      </form>
    </>
  )


}