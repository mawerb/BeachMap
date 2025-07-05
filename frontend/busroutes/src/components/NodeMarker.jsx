import { Marker, Popup, Polyline, useMap } from 'react-leaflet';
import pointImg from '../assets/point.png';
import { use, useEffect } from 'react';


/* NodeMarker.jsx - Renders individual nodes on the map with their neighbors. */
function NodeMarker({
  name,
  node,
  index,
  nodes,
  neighborUI,
  onSetNeighbors,
  onRemoveNodes,
  onRemoveNode,
  onAddNeighbor,
  onChangeName,
  popupRefs,
}) {
  const pointIcon = L.icon({
    iconUrl: pointImg,
    iconSize: [8, 8],
  });

  const curr_map = useMap();

  useEffect(() => {
    const popup = popupRefs.current[index];
    curr_map.openPopup(popup, node.coords);
  },[popupRefs.current[index]]);
  
  return (
    <>
      {Object.entries(node.neighbors || {}).map((neighborIndex => (
        <Polyline
          key={`${index}-${neighborIndex}`}
          positions={[node.coords, nodes[neighborIndex].coords]}
          color="red"
        />
      )))}
      <Marker
        key={index}
        icon={pointIcon}
        position={node.coords}
        eventHandlers={{
          click: () => {
            if (neighborUI) onAddNeighbor(node);
          },
        }}
      >
        {!neighborUI && (
          <Popup ref={(el) => (popupRefs.current[index] = el)}>
            <div>Node {index + 1}: {name}</div>
            <input type="text" onKeyUp={(e) => {
              if (e.key === "Enter") {
              onChangeName(name,e.target.value)}
              }}></input><br></br>
            <button onClick={(e) => { onRemoveNode(name); e.stopPropagation(); }}>
              Delete
            </button>
            <button onClick={() => onSetNeighbors(node)}>Set Neighbors</button><br></br>
            <button onClick={(e) => { onRemoveNode(name); e.stopPropagation(); }}>
              Delete All Nodes
            </button>
          </Popup>
        )}
      </Marker>
    </>
  );
}

export default NodeMarker;