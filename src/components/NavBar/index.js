import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from "react-router-dom"
import LoginModal from "../LoginModal"
import API from "../../utils/API"
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'ESKARGOT'
  },
  navBar: {
    backgroundColor: '#8eb1c7',
    color: 'black'
  }

}));

export default function MenuAppBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  //======================================================================
  //Login/Sign Functions
  //======================================================================

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


  // useEffect(() => {
  //   const token = localStorage.getItem("token")
  //   API.getAuthToken(token).then(res => {
  //     console.log("got the token!")
  //     setUserState({
  //       id: res.data.id,
  //       userName: res.data.userName,
  //       token: token,
  //       isLoggedIn: true
  //     }).then(handleClose())
  //   }).catch(err => {
  //     localStorage.removeItem("token");
  //     console.log("not properly Authed")
  //     console.log(err)
  //   })
  // }, [])

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


  const handleSubmit = event => {
    event.preventDefault()
    console.log("this is the NavBar page.")
    console.log(event.target)
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
        history.go(0)
      }).catch(error => {
        console.log(error);
        localStorage.removeItem("token");
        console.log("token has been removed. Error Login. NavBar line: 123")
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
      setHapticBtn({ Btn: "Have an Account?" })
    } else {
      setFormMsg({ Msg: "Please Login" })
      setHapticBtn({ Btn: "New to the Site?" })
      setFormSwitch({ login: true })
    }
  }



  //======================================================================
  // END OF Login/Sign Functions
  //======================================================================

  const titleClick = () => {
    history.push('/')
  }


  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleCloseModal = () => {
  //   setOpen(false);
  // };

  const logInPopUp = () => {
    console.log("ummm...click")
  }
  const logout = () => {
    console.log("ummm...click-out")
    localStorage.removeItem("token")
    setUserState({
      id: "",
      userName: "",
      isLoggedIn: false
    })
    history.go(0)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.navBar} > {/*color='secondary'*/}
        <Toolbar>
          <Link to="/builder" color="white" variant="body2">Map Builder </Link>
          {/* {props.user.isLoggedIn ? <span><MenuItem onClick={handleClose}>Profile</MenuItem> </span>: null} */}
          {props.user.isLoggedIn ? <span><Link to="/dashboard"> Saved Maps </Link>
          </span> : null}
          <Typography variant='h3' className={classes.title} onClick={titleClick}>
            DunGen
          </Typography>
          {props.user.isLoggedIn ? <Typography variant="h6">{`Welcome ${props.user.userName}`}</Typography> : null}
          <FormGroup>
            {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp}
              handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn}
            /> </span> : <span> <MenuItem onClick={logout}>
              Logout?
              </MenuItem></span>}
          </FormGroup>
          {auth && (
            <div>
              <AccountCircle />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}