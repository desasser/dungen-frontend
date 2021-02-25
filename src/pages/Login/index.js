import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import API from "../../utils/API"
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
export default function Login() {
  const classes = useStyles();
  const [user, setUserState] = useState({
    id: "",
    userName: "",
    token: "",
    isLoggedIn: false
  })

const [loginState, setLoginState] = useState ({
  userName: "",
  password: "",
})

const [signUpState, setSignUpState] = useState({
  userName: "",
  password: ""
})

useEffect(() =>{
  const token = localStorage.getItem("token")
  API.getAuthToken(token).then(res => {
    console.log("got the token!")
    setUserState({
      id: res.data.id,
      userName: res.data.userName,
      token: token,
      isLoggedIn: true
    })
  }).catch(err => {
    localStorage.removeItem("token");
    console.log("not properly Authed")
  })
}, [])

const handleInputChange = event => {
  const { name, value } = event.target;
  setLoginState({
    ...loginState,
    [name]:value
  })
}


//Using the "HandleSubmit" as temple
const handleSubmit = event => {
    event.preventDefault()
    console.log("this is the login page.")
    console.log(event)
    API.login(loginState).then(res=> {
      console.log("so far so good on the API login call.");
      console.log(res);
      localStorage.setItem("token", res.token)
        setUserState({
          id: res.id,
          userName: res.userName,
          token: "",
          isLoggedIn:true
        })
          setLoginState({
            userName: "",
            password: ""
          })     
    }).catch(error=> {
      console.log(error);
      localStorage.removeItem("token");
      console.log("token has been removed. Error Login.line: 83")
    })
  };




  return (
    <div>
      <header className="App-header">
        <h1>DUNGEN: JUNK WIZARDS</h1>
        <Form  handleSubmit= {handleSubmit} handleInputChange = {handleInputChange} userName = {loginState.userName} password = {loginState.password} />
        New to the site?
      </header>
      
    </div>
  );
}