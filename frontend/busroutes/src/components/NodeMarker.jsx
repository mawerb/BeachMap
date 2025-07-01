import { Marker, Popup, Polyline } from 'react-leaflet';
import { useRef } from 'react';

function NodeMarker({
  node,
  index,
  nodes,
  neighborUI,
  onSetNeighbors,
  onRemoveNodes,
  onAddNeighbor,
  popupRefs,
}) {
  const pointIcon = L.icon({
    iconUrl: '/path/to/point.png',
    iconSize: [8, 8],
  });

  return (
    <>
      {node.neighbors.map((neighborIndex) => (
        <Polyline
          key={`${index}-${neighborIndex}`}
          positions={[node.coords, nodes[neighborIndex].coords]}
          color="red"
        />
      ))}
      <Marker
        key={index}
        icon={pointIcon}
        position={node.coords}
        eventHandlers={{
          click: () => {
            if (neighborUI) onAddNeighbor(index);
          },
        }}
      >
        {!neighborUI && (
          <Popup ref={(el) => (popupRefs.current[index] = el)}>
            <div>Node {index + 1}</div>
            <button onClick={(e) => { onRemoveNodes(); e.stopPropagation(); }}>
              Delete
            </button>
            <button onClick={() => onSetNeighbors(index)}>Set Neighbors</button>
          </Popup>
        )}
      </Marker>
    </>
  );
}

export default NodeMarker;