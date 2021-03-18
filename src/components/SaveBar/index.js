import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function SavedBar(props) {
    // console.log(props)
    const classes = useStyles();


    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (props.saved) {
            setOpen(true)
            {props.toggleSavedState()}
        }
    }, [props.saved])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={2500} onClose={handleClose} onChange={props.handleInputChange} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="success">
                    Map Saved!
        </Alert>
            </Snackbar>
        </div>
    );
}