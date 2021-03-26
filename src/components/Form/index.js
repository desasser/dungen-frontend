import React, { useState, useEffect } from 'react';
import { makeStyles, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Alert from '../AlertBar'

const useStyles = makeStyles(() => ({
  submitBtn: {
    '&:hover': {
      color: 'white',
    },
    width: 100,
    height: 40,
    fontSize: '14px',
    fontFamily: 'Immortal',
    marginLeft: '47%'
  },
  input: {
    color: 'white'
  }
}))


export default function Form(props) {
  useEffect(() => {
    console.log(props)
    console.log(props.login)
  }, [])

  const classes = useStyles();

  return (
    <>
      <form onSubmit={props.handleSubmit} onChange={props.handleInputChange} credentials={props.credentials} noValidate autoComplete="off">
        <div>
          <Alert error={props.error} resetError={props.resetError} validationErrorState={props.validationErrorState} resetVal={props.resetVal}></Alert>
          <TextField id="standard-basic" type="text" label="username"
            name="userName" required
            value={props.credentials.userName}
            onSubmit={props.handleSubmit}
            onChange={props.handleInputChange}
            credentials={props.credentials}
            color="secondary"
            InputProps={{
              className: classes.input
            }}
          />
        </div>
        {!props.login ? <span>
          <div>
            <TextField id="standard-basic" type="text" label="email"
              name="email"
              required value={props.credentials.email}
              onChange={props.handleInputChange}
              color="secondary" 
              InputProps={{
                className: classes.input
              }}
              />
          </div>
        </span> : null}
        {!props.login ? <span>
          <div>
            <TextField id="standard-basic" type="text" label="name" name="name"
              value={props.credentials.name}
              onChange={props.handleInputChange}
              color="secondary"
              InputProps={{
                className: classes.input
              }}
            />
          </div>
        </span> : null}
        <div>
          <TextField id="standard-basic" type="password" label="password"
            name="password" required
            value={props.credentials.password}
            onSubmit={props.handleSubmit}
            onChange={props.handleInputChange}
            color="secondary"
            InputProps={{
              className: classes.input
            }}
          />
        </div>
        <Button type="submit" color="primary" variant="contained"
          onClick={props.handleSubmit}
          style={{ marginTop: 15 }}
          className={classes.submitBtn}>
          Submit
        </Button>
      </form>
    </>
  )


}