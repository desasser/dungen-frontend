import React from 'react'
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  errorMessage: {
    fontFamily: 'SpaceAndAstronomy'
  }
})

export default function Nope() {
  const classes = useStyles();

    return (
        <div>
            <Container fixed>
                <Typography variant="h3" gutterBottom className={classes.errorMessage}>
                    You Failed your Charisma Check (503 Not Authorized)
                </Typography>
                <img
                    src="https://cdn.discordapp.com/attachments/806997044643627011/816003634520391730/caw-caw_snail_VERSION_TWO.png"

                />
            </Container>
        </div>
    )
}
