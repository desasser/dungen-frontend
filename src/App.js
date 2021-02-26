import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapBuilder from './pages/MapBuilder';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login";
import API from "./utils/API.js"

function App() {

  const [users, setUserState] = useState({
    id: "",
    userName: "",
    token: "",
    isLoggedIn: false
  })

  const [loginState, setLoginState] = useState({
    userName: "",
    password: "",
  })

  const [signUpState, setSignUpState] = useState({
    userName: "",
    password: ""
  })

  useEffect(() => {
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
      [name]: value
    })
  }


  //Using the "HandleSubmit" as temple
  const handleSubmit = event => {
    event.preventDefault()
    console.log("this is the login page.")
    console.log(event)
    
    API.login(loginState).then(res => {
      console.log("so far so good on the API login call.");
      console.log(res.data);
      localStorage.setItem("token", res.data.token)
      setUserState({
        id: res.data.id,
        userName: res.data.userName,
        token: res.data.token,
        isLoggedIn: true
      })
      setLoginState({
        userName: "",
        name: "",
        password: ""
      })
    }).catch(error => {
      console.log(error);
      localStorage.removeItem("token");
      console.log("token has been removed. Error Login.line: 83")
    })
  };


  return (
    <div className="App">
      {/* <header className="App-header">
        <h1 className="text-2xl text-header">DUNGEN: JUNK WIZARDS</h1>
      </header> */}
      <NavBar />
      <Router>
        <Switch>
          {/* <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} /> */}
          <Route exact path="/">
            <Login handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
        </Route>
 
          <Route exact path="/dashboard" component={MapBuilder} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
