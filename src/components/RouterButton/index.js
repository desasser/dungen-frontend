import React from 'react'
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";


export default function RouterButton(props) {
  return (
    <Router>
      <div>
        <Button color="primary" component={props.component} to={props.route}>
          {props.name}
        </Button>
      </div>
    </Router>
  )
}
