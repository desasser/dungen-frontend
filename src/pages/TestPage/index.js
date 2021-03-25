import React from 'react';
import SuperDrawer from '../../components/SuperDrawer';
import MapCanvas from '../../components/MapCanvas/MapCanvas';
import CanvasContextProvider from '../../contexts/CanvasContext';


export default function TestPage() {
  return (
    <div >
      <CanvasContextProvider>
        <SuperDrawer />
        <MapCanvas />
      </CanvasContextProvider>
    </div>
  )
}
