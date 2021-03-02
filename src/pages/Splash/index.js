import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RouterBtn from '../../components/RouterBtn'

import HomeIcon from '@material-ui/icons/Home';

import { motion } from "framer-motion"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    containerBanner: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: '40vh',
        background: 'gray',
        display: "flex",
        justify: "center",
        margin: "0 auto",
        padding: "10% 25%"

    },
}));


export default function Splash() {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <Grid item xs={12} >
                <Container className={classes.containerBanner} >
                    <motion.div
                        drag
                        dragConstraints={{
                            top: -175,
                            left: -400,
                            right: 600,
                            bottom: 175,
                        }}
                    >Dun</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: -175,
                            left: -400,
                            right: 600,
                            bottom: 175,
                        }}
                    >Gen</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: -175,
                            left: -400,
                            right: 600,
                            bottom: 175,
                        }}
                    >Snail</motion.div>
                    <motion.div
                        drag
                        dragConstraints={{
                            top: -175,
                            left: -400,
                            right: 600,
                            bottom: 175,
                        }}
                    >Butts</motion.div>
                </Container >

                <Container>
                    <h3>
                        Dungen Building should be easy.
                    </h3>
                    <p>

                       An no nonsense approach to making dungens. 
                    </p>
                </Container>

                <RouterBtn to="/builder" name="Build Maps Now!" />
            </Grid>
        </div>
    )
}
