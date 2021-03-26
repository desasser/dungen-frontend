import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import Form from "../../components/Form/index"
import ActionBtn from "../../components/ActionBtn/index"
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#8eb1c7',
    borderRadius: '0.5em',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none'
  },
  navLink: {
    textDecoration: 'none',
    marginLeft: '30px',
    marginRight: '30px',
    marginTop: '10px',
    color: theme.palette.secondary.contrastText,
  },
  menuItem: {
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '16px',
    margin: 0
  },
  loginMsg: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '20px',
    margin: '10px'
  },
  switchBtn: {
    '&:hover' : {
      color: '#36434b',
      backgroundColor: 'white'
    },
    marginBottom: '10px',
    height: 40,
    backgroundColor: '#36434b',
    color: 'white',
    fontSize: '16px',
    fontFamily: 'SpaceAndAstronomy'
  }
}));

export default function LoginModal(props) {
  // console.log(props)

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const history = useHistory(props);
  useEffect(() => {
    // console.log(props)
    if (props.isLoggedIn) {
      handleClose()
    }
  }, [props.isLoggedIn])

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // console.log('check me out!', navigator.userAgent);
  // console.log('mobile?', isMobile);

  return (
    <>
      <Typography variant='h5' type="button" className={!isMobile ? classes.navLink : classes.menuItem} onClick={handleOpen} style={{cursor: 'pointer'}}>
        Login
      </Typography>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }} 
      >
        <Fade in={open}>
          <div className={classes.paper}>

            <ActionBtn action={props.switch} name={props.formBtn} classes={classes.switchBtn}/>
            <Typography variant="h3" className={classes.loginMsg}>{props.formMsg}</Typography>
            <Form credentials={props.credentials} validationErrorState={props.validationErrorState} resetVal={props.resetVal} login={props.login.login} user={props.user} error={props.error} handleSubmit={props.handleSubmit} handleInputChange={props.handleInputChange} />

          </div>
        </Fade>
      </Modal>
    </>
  );
}
