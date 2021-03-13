import React from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Box, Container, Switch, Grid } from '@material-ui/core'
import ActionBtn from '../ActionBtn'
import SliderDrawer from '../SliderDrawer'

const useStyles = makeStyles({
  mapBuilderUIBox: {
    position: 'absolute',
    zIndex: 1000,
    height: '100%',
    width: '100%'
  },
  mapBuilderControlsContainer: {
    position: 'absolute',
    width: 200,
    backgroundColor: 'white',
    height: '100%',
    boxShadow: '2px 0 5px gainsboro',
  },
  centerGrid: {
    backgroundColor: 'green',
    color: 'white'
  },
  recenter: {
    backgroundColor: 'red'
  },
  mapBuilderTileDrawerContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    maxWidth: '20%',
    padding: 0,
    margin: 0,
    boxShadow: '-2px 0 5px gainsboro',

    '& .makeStyles-sideNav-349': {
      position: 'absolute',
      left: '-70%',
      top: 10
    },

    '& .MuiDrawer-docked > div': {
      position: 'absolute',
      right: 0,
      margin: 0,
      maxHeight: '100%',
      overflow: 'show'
    }
  }
});

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: 'gainsboro',
    '&$checked': {
      transform: 'translateX(12px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: 'purple',
        borderColor: 'purple',
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid gainsboro`,
    borderRadius: 'px',
    opacity: 1,
    backgroundColor: 'white',
  },
  checked: {},
}))(Switch);

export default function MapControls({ controlsData }) {
  const classes = useStyles();

  console.log(controlsData.toggleTileLock);

  return (
    <div className={classes.mapBuilderUIBox}>
        <div className={classes.mapBuilderControlsContainer}>
        {controlsData.toggleTileLock.args.visible ?
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Move Tiles</Grid>
            <Grid item>
              <AntSwitch {...controlsData.toggleTileLock.props} />
            </Grid>
            <Grid item>Move Grid</Grid>
          </Grid>
          :
          ''
        }
        <ActionBtn classes={controlsData.centerGrid.args.gridCentered ? classes.centerGrid : `${classes.centerGrid} ${classes.recenter}`} {...controlsData.centerGrid.props}>
          {controlsData.centerGrid.text}
        </ActionBtn>
      </div>

      <div className={classes.mapBuilderTileDrawerContainer}>
        <SliderDrawer />
      </div>
    </div>
  )
}
