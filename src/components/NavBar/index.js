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
import { Link } from "react-router-dom";
import LoginModal from "../LoginModal";
import API from "../../utils/API";
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'ESKARGOT',
    cursor: 'pointer',
    fontWeight: '700',
    // marginLeft: '-10px'
  },
  navBar: {
    backgroundColor: '#8eb1c7',
    color: 'black',
    width: '100vw'
  },
  navLink: {
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '20px',
    marginLeft: '20px',
    color: '#36434b'
  }
}));

export default function MenuAppBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorXSEl, setAnchorXSEl] = useState(null);

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
  const [errorState, setErrorState] = useState({
    error: false
  });

    const handleSubmit = event => {
    event.preventDefault()
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
        setErrorState({
          error: true
        })
        if (errorState){
          setLoginState({
            userName: "",
            password: ""
          })
          setErrorState({
            errorState: false
          })
        }
        
        
        localStorage.removeItem("token");
        console.log("token has been removed. Error Login. NavBar line: 123")
        return error
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
        history.go(0)
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

  const handleXSClick = (event) => {
    setAnchorXSEl(event.currentTarget);
  };

  const handleXSClose = () => {
    setAnchorXSEl(null);
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
          {/* XS NAVIGATION */}
          <Hidden smUp>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleXSClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorXSEl}
              keepMounted
              open={Boolean(anchorXSEl)}
              onClose={handleXSClose}
            >
              {/* <Typography variant='h6'>Welcome {props.user.userName}</Typography> */}
              <MenuItem onClick={handleXSClose}><Link to='/builder'>MAP BUILDER</Link></MenuItem>
              <MenuItem onClick={handleXSClose}><Link to='/dashboard'>SAVED MAPS</Link></MenuItem>
              {/* <MenuItem onClick={handleXSClose}><Link onClick={logout}>Logout</Link></MenuItem> */}
              <FormGroup>
              {!props.user.isLoggedIn ? <span> <Link><LoginModal edge="start" onClick={logInPopUp}
                handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={users} login={formSwitch} error={errorState}
              /> </Link>
              </span> : <span> <MenuItem onClick={logout}>
                <Link>
                LOGOUT?
                </Link>
              </MenuItem></span>}
            </FormGroup>
            </Menu>
          </Hidden>
          {/* XS NAVIGATION */}

          {/* NAVIGATION LINKS */}
          <Hidden xsDown>
            <Link to="/builder" color="white" variant="body2" className={classes.navLink}>Map Builder </Link>
            {props.user.isLoggedIn ? <span><Link to="/dashboard" className={classes.navLink}> Saved Maps </Link>
            </span> : null}
          </Hidden>
          {/* NAVIGATION LINKS */}

          {/* LOGO HEADER */}
          <Typography variant='h3' className={classes.title} onClick={titleClick}>
            DunGen
          </Typography>
          {/* LOGO HEADER */}

          {/* MOBILE RENDER OF LOGIN/LOGOUT */}
          <Hidden smUp>
          <FormGroup>
              {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp}
                handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={users} login={formSwitch} error={errorState}
              /> </span> :  null }
            </FormGroup>
            </Hidden>

          {/* WELCOME USER */}
          <Hidden xsDown>
            {props.user.isLoggedIn ? <Typography variant="h6" className={classes.navLink} >{`Welcome ${props.user.userName}`}</Typography> : null}
            <FormGroup>
              {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp}
                handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={users} login={formSwitch} error={errorState}
              /> </span> : <span> <MenuItem onClick={logout} className={classes.navLink}>
                Logout?
              </MenuItem></span>}
            </FormGroup>
            {auth && (
              <div>
                {props.user.isLoggedIn ? <span> <AccountCircle style={{ fontSize: '50px', color: '#eb4511ff' }} /> </span> : null}
              </div>
            )}
          </Hidden>
          {/* WELCOME USER */}


        </Toolbar>
      </AppBar>
    </div>
  );
}