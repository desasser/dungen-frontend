import React, { useState, useEffect } from 'react';
import StartMap from "../StartMap";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
// import MapBuilder from "../../pages/MapBuilder"
// import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 20000
  },
  paper: {
    backgroundColor: '#8eb1c7',
    borderRadius: '0.5em',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none'
  },

}));

function StartMapModal(props) {

  const classes = useStyles();

  const [open, setOpen] = useState(props.openModal);

  const handleClose = (mapData) => {
    setOpen(false);
    props.handleFormSubmit(mapData)
  };

  useEffect(() => {
    console.log("This is a new map modal thing", props.openModal)
    const savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;
    console.log(savedMap)
    if (savedMap === null || savedMap.layout.length === 0) {
      setOpen(props.openModal)
    } else {
      setOpen(false)
    }
  }, [])

  return (
    <>
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

            <StartMap onClose={(mapData) => handleClose(mapData)} />

          </div>
        </Fade>
      </Modal>
    </>
  )

}

export default StartMapModal