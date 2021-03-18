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

export default function AuthBar(props) {
    // console.log(props)
    const classes = useStyles();


    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (props.auth) {
            setOpen(true)
            { props.toggleAuthState() }
        }
    }, [props.auth])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={2500} onClose={handleClose} onChange={props.handleInputChange} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="info">
                    Please Sign Up or Log In to Save Map
        </Alert>
            </Snackbar>
        </div>
    );
}