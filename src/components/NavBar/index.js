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
import {Link} from "react-router-dom"
import LoginModal from "../LoginModal"
import API from "../../utils/API"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    top: 0,
    zIndex: 9999,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar(props) {
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
    Btn: "Sign Up",
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

  const handleLogin = (data)=> {
    setUserState({...users,isLoggedIn:data})
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
          name: "",
          password: ""
        })
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
          name: "",
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
      setFormMsg({ Msg: "Creat an Account" })
      setHapticBtn({ Btn: "Login" })
    } else {
      setFormMsg({ Msg: "Please Login" })
      setHapticBtn({ Btn: "Sign Up" })
      setFormSwitch({ login: true })
    }
  }

  

  //======================================================================
  // END OF Login/Sign Functions
  //======================================================================




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

  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Toolbar>
        {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp} 
        handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn}
        /> </span>: null}
          <Typography variant="h4" className={classes.title}>
            DunGen
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
              label={auth ? 'Logout' : null}
            />
          </FormGroup>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}> <Link to ="/dashboard">Dashboard </Link></MenuItem> 
                {/* {props.user.isLoggedIn ? <span><MenuItem onClick={handleClose}>Profile</MenuItem> </span>: null} */}
                {/* <MenuItem onClick={handleClose}>Saved Maps</MenuItem> */}
                {props.user.isLoggedIn ? <span><MenuItem onClick={handleClose}><Link to="/dashboard">Dashboard </Link>
                </MenuItem> </span> : null}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}