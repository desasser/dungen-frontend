import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import MapBuilder from './pages/MapBuilder';
import SavedMaps from './pages/SavedMaps';
import BrowseMaps from './pages/BrowseMaps';
import BrowseUsers from './pages/BrowseUsers';
import RenderedMap from './pages/RenderedMap';
import TestPage from './pages/TestPage';
import NavBar from "./components/NavBar/index"
import Login from "./pages/Login";
import Splash from "./pages/Splash/index"
import Nope from "./pages/503"
import FourOhNope from "./pages/404"
import API from "./utils/API.js"
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core';
import theme from './theme'

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

  const [snailState, setSnailState] = useState({
    snail: false
  })

  const token = localStorage.getItem("token")

  useEffect(() => {
    userAuth()
  }, [])

  const userAuth = () => {
    API.getAuthToken(token).then(res => {
      // console.log("got the token!")
      setUserState({
        id: res.data.id,
        userName: res.data.userName,
        token: token,
        isLoggedIn: true
      })
    }).catch(err => {
      // console.log(err)
      localStorage.removeItem("token");
      // console.log("not properly Authed")
      setLoginState({
        userName: "",
        password: ""
      })
      setSnailState({
        snail: true
      })
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLoginState({
      ...loginState,
      [name]: value
    })
    // console.log(loginState)
  }

  // const redirect = ()=>history.push("/dashboard")
  const handleLogin = (data) => {
    setUserState({ ...users, isLoggedIn: data })
  }

  //Using the "HandleSubmit" as temple
  const handleSubmit = event => {
    event.preventDefault()
    // console.log("this is the login page.")
    console.log(event)

    if (formSwitch.login === true) {
      API.login(loginState).then(res => {
        // console.log("so far so good on the API login call.");
        // console.log(res.data);
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
        // console.log("so far so good on the API login call.");
        // console.log(res.data);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ background: theme.palette.primary.mainGradient, minHeight: '100vh' }}>
        <Router>
          <NavBar user={users} />
          <Switch>
            {/* why twice? */}
            <Route exact path="/" component={Splash} />

            <Route exact path="/">
              <Splash />
            </Route>

            <Route exact path="/login">
              <Login handleSubmit={handleSubmit} handleInputChange={handleInputChange}
                // switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} 
                isLoggedIn={users.isLoggedIn} />
            </Route>
            {users.isLoggedIn ? (
              <Route exact path="/dashboard">
                {users.isLoggedIn ? <SavedMaps users={users} /> : null}
              </Route>
            ) : (
              <Route exact path="/503" >
                {snailState ? <Nope /> : null}
              </Route>
            )}

            <Route exact path="/builder">
              <MapBuilder users={users} />
            </Route>
            <Route exact path="/builder/:id">
              <MapBuilder users={users} />
            </Route>

            <Route exact path="/preview">
              <RenderedMap />
            </Route>

            <Route exact path="/browsemaps">
              <BrowseMaps users={users} />
            </Route>

            <Route exact path="/browseusers">
              <BrowseUsers users={users} />
            </Route>

            <Route exact path="/testspace">
              <TestPage />
            </Route>

            <Route exact path="/render/:id">
              {users.isLoggedIn ? <RenderedMap /> : <Nope />}
            </Route>

            <Route component={FourOhNope} />

            <Route exact path="/503">
              <Nope />
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
