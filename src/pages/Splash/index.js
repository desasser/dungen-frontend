import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import HomeIcon from '@material-ui/icons/Home';

import { motion } from "framer-motion"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    container: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        Height: '40vh',
        background: 'gray',
        display: "flex",
        justify:"center",
        margin:"0 auto",
        padding: "0 25%"

    },
}));


export default function Splash() {
    const classes = useStyles();
    
    
    return (
        <div className={classes.root}>
            <Grid item xs={12} >
                <Container className={classes.container} >
                    <motion.div
                        drag
                        dragConstraints={{
                            top: "-10%",
                            left: "-10%",
                            right: "10%",
                            bottom: "10%",
                        }}
                    >Dun</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: "-10%",
                            left: "-10%",
                            right: "10%",
                            bottom: "10%",
                        }}
                    >Snail</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: "-10%",
                            left: "-10%",
                            right: "10%",
                            bottom: "10%",
                        }}
                    >Snail</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: "-10%",
                            left: "-10%",
                            right: "10%",
                            bottom: "10%",
                        }}
                    >Butts</motion.div>
                </Container >
            </Grid>
        </div>
    )
}
