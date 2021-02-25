import React from 'react'
import IconButton from '@material-ui/core/IconButton';

export default function IconBtn(props) {
    return (
        <div>
            <IconButton aria-label={props.label} className={props.classes} onClick={props.onClick}>
                {props.children}
            </IconButton>
        </div>
    )
}
