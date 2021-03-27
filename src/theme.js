import { Button } from '@material-ui/core';
import { createMuiTheme }  from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
        color: 'white',
      },
    MuiInputLabel: {
      root: {
        color: 'white',
      }
    },
  },
  palette: {
    primary: {
      main:'#03131e',
      mainGradient: "radial-gradient(ellipse at 20% 30%, #f8b24c, #03131e",
      contrastText: '#f8b24c'
    },
    secondary: { 
      main: '#f8b24c',
      contrastText: '#f3e3e4'
    },
    background: {
      paper: '#2e3743',
    },
  },
  typography: {
    h1: {
      fontFamily: 'BreathZelda, Arial Black, Arial'
    },
    h2: {
      fontFamily: 'BreathZelda, Arial Black, Arial'
    },
    h3: {
      fontFamily: 'BreathZelda, Arial Black, Arial'
    },
    h4: {
      fontFamily: 'Immortal, Arial Black, Arial'
    },
    h5: {
      fontFamily: 'Immortal, Arial Black, Arial'
    },
    h6: {
      fontFamily: 'Immortal, Arial Black, Arial'
    },
    subtitle1 : {
      fontFamily: 'Arial'
    },
    subtitle2 : {
      fontFamily: 'Arial'
    },
    body1 : {
      fontFamily: 'Arial'
    },
    body2 : {
      fontFamily: 'Arial'
    },
    button : {
      fontFamily: 'Arial'
    },
    caption : {
      fontFamily: 'Arial'
    },
    overline : {
      fontFamily: 'Arial'
    },
  }
})

export default theme;