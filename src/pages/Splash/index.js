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
                    >Snail</motion.div>
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
                    <p>
                        I'm baby jianbing typewriter selvage, authentic celiac lyft blog wayfarers XOXO PBR&B vape. Vape pickled organic artisan. Ramps PBR&B snackwave locavore XOXO listicle you probably haven't heard of them actually pug semiotics offal street art messenger bag occupy craft beer. Actually freegan before they sold out, copper mug narwhal swag vexillologist 8-bit meh brooklyn sartorial flannel DIY stumptown. Wolf fixie food truck art party prism DIY microdosing farm-to-table plaid viral selfies 8-bit subway tile ennui scenester. Vice tattooed shoreditch, hoodie neutra bushwick helvetica crucifix blue bottle narwhal tumeric. +1 echo park brunch paleo deep v affogato.
                    </p>
                    <p>

                        Post-ironic poutine readymade authentic tote bag biodiesel la croix franzen heirloom affogato cred intelligentsia thundercats. Occupy fashion axe freegan, roof party cold-pressed four dollar toast green juice. Dreamcatcher keytar taiyaki church-key schlitz prism. PBR&B kickstarter etsy keffiyeh poutine, cliche four dollar toast brunch. Migas actually VHS poutine. Butcher whatever actually poutine quinoa green juice venmo cray succulents beard roof party.
                    </p>
                </Container>

                <RouterBtn to="/builder" name="Build Maps Now!" />
            </Grid>
        </div>
    )
}
