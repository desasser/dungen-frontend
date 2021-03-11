import React from 'react'
import { Stage, Layer } from 'react-konva'

import CoordinateGrid from './CoordinateGrid'

export default function MapCanvas() {
  return (
    <div>
      <div>
        <Button type={tilesLocked ? "success" : "warn"} onClick={handleGridLock}>{tilesLocked ? "Unlock (to move Tiles)" : "Lock (to move Map)"}</Button>
        <Button type={gridCentered ? "success" : "warn"} onClick={recenterGrid}>{gridCentered ? "Grid Centered" : "Center Grid"}</Button>
          <TileDrawer />
      </div>

      <div id="map-builder-stage-container" onDrop={(e) => handleNewTileDrop(e)} onDragOver={(e) => e.preventDefault()}>
        <Stage
          ref={stageRef}
          x={stagePosition.x}
          y={stagePosition.y}
          width={window.innerWidth - 25}
          height={window.innerHeight}
          draggable={tilesLocked}
          onClick={(e) => handleStageClick(e)}
          onContextMenu={(e) => handleRightClick(e)}
          onDragEnd={(e) => handleGridDrag(e)}
          style={{border: "2px solid black", margin: "0"}}
        >
          {/* grid coordinate/"checkerboard" squares layer */}
          <Layer>{coordinateSquares}</Layer>

          {/* "shadow" tiles */}
          <Layer id="shadow-tile-container">
            <Rect {...shadowTileParams} />
          </Layer>

          {/* ACTUAL TILES LAYER */}
          <Layer id="tiles-layer">
          {
          mapLayout.map(tile => 
            <Tile
              key={tile.groupKey}
              draggable={!tilesLocked}
              imgKey={tile.imgKey}
              image_src={tile.image_src}
              width={grid.tileSize}
              height={grid.tileSize}
              rotation={tile.rotation}
              scale={tile.scale}
              x={tile.x * grid.tileSize}
              y={tile.y * grid.tileSize}
              onDragStart={handleTileDragStart}
              onDragMove={handleTileDragMove}
              onDragEnd={handleTileDragEnd}
            />
          )
          }
          </Layer>
        </Stage>
        <TileControls id="tile-controls" display="none" />
      </div>
    </div>
  )
}
