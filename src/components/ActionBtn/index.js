import React from 'react'
import Button from '@material-ui/core/Button';

export default function ActionBtn(props) {
    return (
        <div>
            <Button variant="contained" onClick={props.action}>{props.name}</Button>
        </div>
    )
}
