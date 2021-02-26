import React,{useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Form from "../../components/Form/index"
import ActionBtn from "../../components/ActionBtn/index"
import RouterBtn from "../../components/RouterBtn/index"


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
  const history = useHistory();
useEffect(()=>{
if(props.isLoggedIn){
  history.push("/dashboard")
}
const handleFormSubmit= (e =>{
  props.handleSubmit(e,history)
})
},[props.isLoggedIn])

  return (
    <div>
      <header className="App-header">
        <h1>{props.formMsg}</h1>
        <Form handleSubmit={props.handleSubmit} handleInputChange={props.handleInputChange} />
        <ActionBtn action={props.switch} name={props.formBtn} />
      </header>
    </div>
  );
}