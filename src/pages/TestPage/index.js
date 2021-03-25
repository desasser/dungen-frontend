import React from 'react';
import SuperDrawer from '../../components/SuperDrawer';
import CanvasContextProvider from '../../contexts/CanvasContext';


export default function TestPage() {
  return (
    <div >
      <CanvasContextProvider>
        <SuperDrawer />
      </CanvasContextProvider>
    </div>
  )
}
