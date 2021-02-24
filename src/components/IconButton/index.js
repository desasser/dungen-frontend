import React from 'react'
import IconButton from '@material-ui/core/IconButton';

export default function IconButton(props) {
    return (
        <div>
            <IconButton aria-label={props.label}>
                {props.children}
            </IconButton>
        </div>
    )
}
