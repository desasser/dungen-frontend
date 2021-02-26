import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Form from "../../components/Form/index"


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

//Start The Hard Part Here
export default function Login(props) {
  const classes = useStyles();

  return (
    <div>
      <header className="App-header">
        <h1>DUNGEN: JUNK WIZARDS</h1>
        <Form  handleSubmit= {props.handleSubmit} handleInputChange = {props.handleInputChange} />
        New to the site?
      </header>
      
    </div>
  );
}