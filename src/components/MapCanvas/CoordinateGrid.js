import React from 'react'
import { Layer, Group, Rect, Text } from 'react-konva'

export default function CoordinateGrid({ stagePosition }) {
  
  const [coordinateSquares, setCoordinateSquares] = React.useState([]);

  /**
   * INFINITE GRID *ONLY*
   */
   React.useEffect(() => {
    console.log("infinite grid setup triggered")
    const gridInit = updateGridProps();

    var i = 0;
    const gridColors = [['gainsboro', 'white'], ['white', 'gainsboro']]
    const cSquares = [];
    for(var x = gridInit.startX; x < gridInit.endX; x += gridInit.tileSize) {
      for(var y = gridInit.startY; y < gridInit.endY; y += gridInit.tileSize ) {
        if(i === 4) { i = 0; }
        
        const ix = Math.abs(x / gridInit.tileSize) % gridColors.length;
        const iy = Math.abs(y / gridInit.tileSize) % gridColors[0].length;

        cSquares.push(
          <Group key={`${x}-${y}`} name={`${x}-${y}`}>
            <Rect
              key={`cs-${x}-${y}`}
              x={x}
              y={y}
              width={gridInit.tileSize}
              height={gridInit.tileSize}
              fill={gridColors[ix][iy]}
              stroke="gainsboro"
            />
            <Text
              key={`ct-${x}-${y}`}
              text={`${x / 100}, ${y / 100}`}
              x={x + 10}
              y={y + 10}
              fill="grey"
            />
          </Group>
        );
      }
    }
    setCoordinateSquares(cSquares);
    // eslint-disable-next-line
  }, [stagePosition]);

  return (
    <Layer>{coordinateSquares}</Layer>
  )
}
