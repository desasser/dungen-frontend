import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from "react-router-dom";
import LoginModal from "../LoginModal";
import API from "../../utils/API";
import { useHistory } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    boxSizing: 'border-box',
    flexGrow: 1,
    position: 'sticky',
    top: 0,
    zIndex: 9999,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'ESKARGOT',
    cursor: 'pointer',
    fontWeight: '700',
  },
  navBar: {
    backgroundColor: '#8eb1c7',
    color: 'black',
    // width: '100vw'
  },
  navLink: {
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '20px',
    marginLeft: '20px',
    color: '#36434b',
  },
  menuStyle: {
    '& .MuiMenu-paper': {
      backgroundColor: '#cad8e0'
    }
  },
  menuItemStyle: {
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy'
  },
  menuItemStyleLogin: {
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy',
  },
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
    email: "",
    name: ""
  })

  const handleInputChange = event => {
    const { name, value } = event.target;
    setLoginState({
      ...loginState,
      [name]: value
    })
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
        console.log(loginState);
        setErrorState({
          error: true
        })
      setLoginState({
      userName: "",
      password: ""
      })
      console.log(loginState)
      setErrorState({
        errorState: false
      })
        
        localStorage.removeItem("token");
        console.log("token has been removed. Error Login. NavBar line: 148")
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
          password: "",
          email: "",
          name: ""
        })
        history.go(0)
      }).catch(error => {
        console.log(error);
        setLoginState({
          userName: "",
          password: "",
          email: "",
          name: ""
        })
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

  const handleXSClick = (event) => {
    setAnchorXSEl(event.currentTarget);
  };

  const handleXSClose = () => {
    setAnchorXSEl(null);
  };

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
    history.push("/")
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
            {/* MOBILE MENU */}
            <Menu
              id="simple-menu"
              anchorEl={anchorXSEl}
              keepMounted
              open={Boolean(anchorXSEl)}
              onClose={handleXSClose}
              className={classes.menuStyle}
            >
              <MenuItem onClick={handleXSClose}><Link to='/builder' className={classes.menuItemStyle}>MAP BUILDER</Link></MenuItem>
              <Divider />
              <MenuItem onClick={handleXSClose}><Link to='/dashboard' className={classes.menuItemStyle}>SAVED MAPS</Link></MenuItem>
              <Divider />
              
              <FormGroup>
                {!props.user.isLoggedIn ? <MenuItem>
                  <Link className={classes.menuItemStyle}>
                    <LoginModal edge="start" onClick={logInPopUp}
                      handleSubmit={handleSubmit} credentials={loginState} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={props.user} login={formSwitch} error={errorState}
                    />
                  </Link>
                </MenuItem> : <MenuItem onClick={logout}>
                  <Link className={classes.menuItemStyle}>
                      LOGOUT?
                </Link>
                  </MenuItem>}
              </FormGroup>
            </Menu>
            {/* MOBILE MENU */}
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

          {/* WELCOME USER */}
          <Hidden xsDown>
            {props.user.isLoggedIn ? <Typography variant="h6" className={classes.navLink} >{`Welcome ${props.user.userName}`}</Typography> : null}
            <FormGroup>
              {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp}
                credentials={loginState}  handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={users} login={formSwitch} error={errorState}
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