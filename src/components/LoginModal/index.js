import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import Form from "../../components/Form/index"
import ActionBtn from "../../components/ActionBtn/index"
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

//   const history = useHistory();
// useEffect(()=>{
// if(props.isLoggedIn){
//   history.push("/dashboard")
// }
// const handleFormSubmit= (e =>{
//   props.handleSubmit(e,history)
// })
// },[props.isLoggedIn])

  return (
    <div>
      <MenuItem type="button" onClick={handleOpen}>
        Login
      </MenuItem>
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
          <h1>{props.formMsg}</h1>
        <Form handleSubmit={props.handleSubmit} handleInputChange={props.handleInputChange} />
        <ActionBtn action={props.switch} name={props.formBtn} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
