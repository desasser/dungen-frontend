import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function Login() {
  const [user, setUser] = useState({})
  const classes = useStyles();
  
  
  
  function handleInputChange(event) {
    const { name, value } = event.target;
    setUser({...user, [name]: value})
  };

  function handleSubmit(event) {
    event.preventDefault()
    console.log({
      userName: user.userName,
      name: user.name,
      password: user.password
    })
    // NOTE FROM CALVIN: I wrote an API route, but I wanted to wait before creating a "utils" & "API" files.
    // API.saveUser({
    //   userName: user.userName,
    //   name: user.name,
    //   password: user.password
    // })
    //   .then(res.status(200))
    //   .catch(error => console.log(error));
  }

  return (
    <div>
    
    <form className={classes.root} noValidate autoComplete="off">
    <div>
    <TextField id="standard-basic" type="text" label="User Name" name="userName" onChange={handleInputChange} 
    />
    </div>
    <div>
    <TextField id="standard-basic" type="text" label="Name" name="name"onChange={handleInputChange} 
    />
    </div>
    <div>
    <TextField id="standard-basic" type="text" label="Password" name="password"onChange={handleInputChange}
    />
    </div>
    <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>
      Get 'er Dun(..gen) Why is this in all caps?
      </Button>  
      
    </form>

    
    </div>
  );
}