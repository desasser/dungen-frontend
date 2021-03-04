import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapBuilder from './pages/MapBuilder';
import SavedMaps from './pages/SavedMaps';
import RenderedMap from './pages/RenderedMap';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login";
import Splash from "./pages/Splash/index"
import Nope from "./pages/503"
import FourOhNope from "./pages/404"
import API from "./utils/API.js"


function App() {

  const [users, setUserState] = useState({
    id: "",
    userName: "",
    token: "",
    isLoggedIn: false
  })

  const [formSwitch, setFormSwitch] = useState({
    login: true
  })

  const [formMsg, setFormMsg] = useState({
    Msg: "Please Login",
  })

  const [hapticBtn, setHapticBtn] = useState({
    Btn: "Switch to: Sign Up",
  })

  const [loginState, setLoginState] = useState({
    userName: "",
    password: "",
  })

  const token = localStorage.getItem("token")

  useEffect(() => {
    userAuth()
  }, [])

  const userAuth = () => {
    API.getAuthToken(token).then(res => {
      console.log("got the token!")
      setUserState({
        id: res.data.id,
        userName: res.data.userName,
        token: token,
        isLoggedIn: true
      })
    }).catch(err => {
      console.log(err)
      localStorage.removeItem("token");
      console.log("not properly Authed")
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLoginState({
      ...loginState,
      [name]: value
    })
  }

  // const redirect = ()=>history.push("/dashboard")
  const handleLogin = (data) => {
    setUserState({ ...users, isLoggedIn: data })
  }

  //Using the "HandleSubmit" as temple
  const handleSubmit = event => {
    event.preventDefault()
    console.log("this is the login page.")
    console.log(event)

    if (formSwitch.login === true) {
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
          password: ""
        })
      }).catch(error => {
        console.log(error);
        localStorage.removeItem("token");
        console.log("token has been removed. Error Login.line: 98")
      })
    } else {
      API.signup(loginState).then(res => {
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
          password: ""
        })
      }).catch(error => {
        console.log(error);
        localStorage.removeItem("token");
        console.log("token has been removed. Error Login.line: 83")
      })
    }
  };

  const signUpBtn = click => {
    console.log(click)
    if (formSwitch.login === true) {
      setFormSwitch({ login: false })
      setFormMsg({ Msg: "Create an Account" })
      setHapticBtn({ Btn: "Switch to: Login" })
    } else {
      setFormMsg({ Msg: "Please Login" })
      setHapticBtn({ Btn: "Switch to: Sign Up" })
      setFormSwitch({ login: true })
    }
  }


  return (
    <div className="App">
      <Router>
        <NavBar user={users} />
        <Switch>
          <Route exact path="/" component={Splash} />

          <Route exact path="/login">
            <Login handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} />
          </Route>
          <Route exact path="/">
            <Splash />
          </Route>

          <Route exact path="/dashboard">
            {users.isLoggedIn ? <SavedMaps users={users} /> : <Nope />}
          </Route>
          <Route exact path="/503">
            <Nope />
          </Route>
          
          <Route exact path="/builder">
            <MapBuilder users={users}/>
          </Route>
          <Route exact path="/builder/:id">
            <MapBuilder users={users}/>
          </Route>
          
          <Route exact path="/render">
            {users.isLoggedIn ? <RenderedMap /> : <Nope />}
          </Route>

          <Route component={FourOhNope} />

          <Route exact path="/503">
            <Nope />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
