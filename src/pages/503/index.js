import React from 'react'
import { Container, Typography } from '@material-ui/core';

export default function Nope() {
    return (
        <div>
            <Container fixed>
                <Typography variant="h3" gutterBottom>
                    You Failed your Charisma Check (503 Not Authorized)
                </Typography>
                <img
                    src="https://cdn.discordapp.com/attachments/806997044643627011/816003634520391730/caw-caw_snail_VERSION_TWO.png"

                />
            </Container>
        </div>
    )
}