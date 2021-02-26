import React from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

export default function SavedMapThumbnail() {
  let placeholderStyle = {
    width: 100,
    height: 100,
    backgroundColor: '#FFB5C2',
    margin: 25,
    
  }

  return (
    <Container style={placeholderStyle}>
      <Typography variant='body1'>I am a map!</Typography>
    </Container>
  )
}
