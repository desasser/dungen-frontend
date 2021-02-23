import React, { useState } from "react";
import Grid from '../../components/Grid';
import Drawer from '../../components/Drawer';
import Button from '../../components/Button';


export default function MapBuilder() {
  const [tileDrawerState, setTileDrawerState] = useState({ drawerOpen: false });

  return (
    <div>
      {/* <StyledDrawer /> for side navigation */}
      {/* <Navbar /> */}
      <Grid />
      <Drawer show={tileDrawerState.drawerOpen} />
      {/* Tile Drawer Button */}
      <Button /> 
      {/* Reset Map Button */}
      <Button />
      {/* Lock Map Button */}
      <Button />
      {/* Render/Save/Export Button */}
      <Button />
    </div>
  )
}
