import React from 'react'
import Button from '@material-ui/core/Button';

export default function ActionButton(props) {
    return (
        <div>
            <Button variant="contained" onClick={props.action}>{props.name}</Button>
        </div>
    )
}