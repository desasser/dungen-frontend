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
    backgroundColor: '#2e3743da',
    borderRadius: '0.5em',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
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
    fontSize: '16px',
    margin: 0
  },
  loginMsg: {
    margin: '10px',
    color: theme.palette.secondary.main
  },
  switchBtn: {
    '&:hover' : {
      color:'white',
      backgroundColor: theme.palette.primary.main,
    },
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    marginBottom: '10px',
    height: 40,
    fontFamily: 'Immortal',
    marginLeft: '38%'
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

            <Typography variant="h4" className={classes.loginMsg}>{props.formMsg}</Typography>
            <Form credentials={props.credentials} resetError={props.resetError} validationErrorState={props.validationErrorState} resetVal={props.resetVal} login={props.login.login} user={props.user} error={props.error} handleSubmit={props.handleSubmit} handleInputChange={props.handleInputChange}  />
            <Typography variant='body2' style={{marginTop: 10, color:"white", textAlign: 'right', marginRight: '10%'}}>
              {props.login.login ? "Don't have an account?" : "Have an account?"}
            </Typography>
            <ActionBtn action={props.switch} name={props.formBtn} classes={classes.switchBtn} style={{marginTop: 5, height: '40px', width: '120px'}}/>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
