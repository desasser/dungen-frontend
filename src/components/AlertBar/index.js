import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export default function CustomizedSnackbars(props) {
  console.log(props)
  const classes = useStyles();

  
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (props.error.error) {
      setOpen(true)
    } 
    if
      (props.validationErrorState.userName) {
        console.log("Alert Bar sayz, username is false")
        setOpen(true)
      } 
      if
      (props.validationErrorState.email) {
        console.log("Alert Bar sayz, email is false")
        setOpen(true)
      }
      if
      (props.validationErrorState.password) {
        console.log("Alert Bar sayz, p-word is false")
        setOpen(true)
      }
  }, [props.error, props.validationErrorState])


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.resetVal()
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose} onChange={props.handleInputChange} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        
         {props.validationErrorState.userName ? <Alert  onClose={handleClose} severity="info">
            Not a valid user name. Try it again. 
            </Alert>:  
          props.validationErrorState.email ? <Alert onClose={handleClose} severity="warning">
            Not a valid email bud. Try it again. 
            </Alert>:
            props.validationErrorState.password ? <Alert onClose={handleClose} severity="error">
            Not a valid password bruv. Try it again. 
            </Alert>:
            props.error.error ? <Alert onClose={handleClose} severity="error">
            Invalid username or password. Try again. 
            </Alert> : null}
      </Snackbar>
    </div>
  );
}