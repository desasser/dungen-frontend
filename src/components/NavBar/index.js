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
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    top: 0,
    zIndex: 1300,
    width: '90%',
    margin: '0 auto',
    alignItems: 'center',
  },
  title: {
    cursor: 'pointer',
  },
  navBar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: '75px',
  },
  navLink: {
    textDecoration: 'none',
    marginLeft: '30px',
    marginRight: '30px',
    marginTop: '10px',
    color: theme.palette.secondary.contrastText,
  },
  menuItemStyle: {
    color: theme.palette.secondary.contrastText,
    textDecoration: 'none',
  },
  menuItemStyleLogin: {
    color: theme.palette.secondary.contrastText,
    textDecoration: 'none',
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

  const [formSubText, setFormSubText] = useState({
    subtext: "Don't have an account?"
  })

  const [hapticBtn, setHapticBtn] = useState({
    Btn: "Sign Up",
  })

  const [loginState, setLoginState] = useState({
    userName: "",
    password: "",
    email: "",
    name: ""
  })

  const [validationErrorState, setValidationErrorState] = useState({
    userName: false,
    email: false,
    password: false
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

  const resetError = () => {
    setErrorState({
      error: false
    })
  }

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
        // setErrorState({
        //   error: false
        // })
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
        console.log(error.response.data.errors);
        if (error.response.data.errors[0].path === "userName") {
          setValidationErrorState({
            ...validationErrorState,
            userName: true
          })
          console.log(validationErrorState.userName)
        }
        else if (error.response.data.errors[0].path === "email") {
          setValidationErrorState({
            ...validationErrorState,
            email: true
          })
          console.log(validationErrorState.email)
        }
        else if (error.response.data.errors[0].path === "password") {
          setValidationErrorState({
            ...validationErrorState,
            password: true
          })
          console.log(validationErrorState.password)
        }

        localStorage.removeItem("token");
        console.log("token has been removed. Error Login.line: 83")
      })
    }
  };

  const signUpBtn = click => {
    // console.log(click)
    if (formSwitch.login === true) {
      setFormSwitch({ login: false })
      setFormMsg({ Msg: "Sign Up" })
      setHapticBtn({ Btn: "Login" })
      setFormSubText({ subtext: "Don't have an account?" })
    } else {
      setFormMsg({ Msg: "Please Login" })
      setHapticBtn({ Btn: "Sign Up" })
      setFormSwitch({ login: true })
      setFormSubText({ subtext: "Have an account?" })
    }
  }

  const resetValidationErrorState = () => {
    setValidationErrorState({
      userName: false,
      email: false,
      password: false
    })
  }

  //======================================================================
  // END OF Login/Sign Functions
  //======================================================================

  const titleClick = () => {
    history.push('/')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleXSClick = (event) => {
    setAnchorXSEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <div>
      <AppBar position="static" className={classes.navBar} > {/*color='secondary'*/}
        <Toolbar className={classes.root}>

          {/* LOGO HEADER */}
          <Typography variant='h2' className={classes.title} onClick={titleClick}>
            DunGen
          </Typography>
          {/* LOGO HEADER */}

          {/* XS NAVIGATION */}
          <Hidden smUp>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleXSClick}>
              <MenuIcon color='secondary' fontSize='large' />
            </IconButton>
            {/* MOBILE MENU */}
            <Menu
              id="simple-menu"
              anchorEl={anchorXSEl}
              keepMounted
              open={Boolean(anchorXSEl)}
              onClose={handleXSClose}
            >
              <MenuItem onClick={handleXSClose}>
                <Link to='/builder' className={classes.menuItemStyle}>
                  <Typography variant='h6'>
                    Builder
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleXSClose}>
                <Link to='/dashboard' className={classes.menuItemStyle}>
                  <Typography variant='h6'>
                    Mapcase
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <Link to="/browsemaps" className={classes.menuItemStyle}>
                <MenuItem onClick={handleXSClose}>
                  <Typography variant='h6'>
                    Maps
                </Typography>
                </MenuItem>
              </Link>
              <Divider />
              <Link to="/browseusers" className={classes.menuItemStyle}>
                <MenuItem onClick={handleXSClose}>
                  <Typography variant='h6'>
                    Users
                </Typography>
                </MenuItem>
              </Link>
              <Divider />
              <FormGroup>
                {!props.user.isLoggedIn ? <MenuItem>
                  <Link to='' className={classes.menuItemStyle}>
                    <LoginModal edge="start" onClick={logInPopUp}
                      handleSubmit={handleSubmit} credentials={loginState} validationErrorState={validationErrorState}
                      resetVal={resetValidationErrorState} resetError={resetError} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={props.user} login={formSwitch} error={errorState}
                    />
                  </Link>
                </MenuItem> : <MenuItem onClick={logout}>
                  <Link to='/' className={classes.menuItemStyle}>
                    <Typography variant='h6'>
                      Logout
                  </Typography>
                  </Link>
                </MenuItem>}
              </FormGroup>
            </Menu>
            {/* MOBILE MENU */}
          </Hidden>
          {/* XS NAVIGATION */}

          {/* NAVIGATION LINKS */}
          <Hidden xsDown>
            <Box style={{ display: 'flex' }}>
              <Link to="/builder" className={classes.navLink}>
                <Typography variant='h6'>
                  Builder
                </Typography>
              </Link>
              <Typography aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.navLink} variant='h6' style={{cursor: 'pointer'}}>
                  Browse
              </Typography>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link to="/browsemaps" className={classes.navLink}>
                    <Typography variant='h6'>
                      Maps
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/browseusers" className={classes.navLink}>
                    <Typography variant='h6'>
                      Users
                    </Typography>
                  </Link>
                </MenuItem>
              </Menu>


              {props.user.isLoggedIn ?
                <Link to="/dashboard" className={classes.navLink}>
                  <Typography variant='h6' >
                    Mapcase
                </Typography>
                </Link>
                :
                null}
              {/* NAVIGATION LINKS */}

              {/* WELCOME USER */}
              <FormGroup>
                {!props.user.isLoggedIn ?
                  <LoginModal edge="start" onClick={logInPopUp}
                    credentials={loginState} validationErrorState={validationErrorState} resetVal={resetValidationErrorState} resetError={resetError} handleSubmit={handleSubmit} handleInputChange={handleInputChange} switch={signUpBtn} formMsg={formMsg.Msg} formBtn={hapticBtn.Btn} isLoggedIn={users.isLoggedIn} user={users} login={formSwitch} error={errorState}
                  />
                  :
                  <MenuItem onClick={logout} className={classes.navLink}>
                    <Typography variant='h6' style={{ marginTop: '-5px', marginLeft: '-10px' }}>
                      Logout?
                  </Typography>
                  </MenuItem>}
              </FormGroup>
              {auth && (
                <div>
                  {props.user.isLoggedIn ?
                    <AccountCircle style={{ fontSize: '50px', color: '#f8b24c' }} />
                    :
                    null}
                </div>
              )}
            </Box>
          </Hidden>
          {/* WELCOME USER */}
        </Toolbar>
      </AppBar>
    </div>
  );
}