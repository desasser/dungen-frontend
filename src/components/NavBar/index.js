import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import RouterBtn from "../../components/RouterBtn"
import Menu from '@material-ui/core/Menu';
import {Link} from "react-router-dom"
import LoginModal from "../LoginModal"

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

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logInPopUp = () => {
    console.log("ummm...click")
  }

  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Toolbar>
        {!props.user.isLoggedIn ? <span> <LoginModal edge="start" onClick={logInPopUp}></LoginModal> </span>: null}
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
                {props.user.isLoggedIn ? <span><MenuItem onClick={handleClose}><Link to ="/dashboard">Dashboard </Link></MenuItem> </span> : null}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}