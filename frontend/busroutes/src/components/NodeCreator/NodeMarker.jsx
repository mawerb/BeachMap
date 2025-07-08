/**
 * NodeMarker.jsx - Renders individual nodes on the map with their neighbors.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the node.
 * @param {Object} props.node - The node object containing coordinates and neighbors.
 * @param {number} props.index - The index of the node in the nodes array.
 * @param {Array} props.nodes - The array of all nodes.
 * @param {boolean} props.neighborUI - Flag to indicate if the neighbor UI is active.
 * @param {Function} props.onSetNeighbors - Function to set neighbors for the node.
 * @param {Function} props.onRemoveNodes - Function to remove all nodes.
 * @param {Function} props.onRemoveNode - Function to remove a specific node.
 * @param {Function} props.onAddNeighbor - Function to add a neighbor to the node.
 * @param {Function} props.onChangeName - Function to change the name of the node.
 * @param {Object} props.popupRefs - References to the popups for each node.
 *
 * @returns {JSX.Element} The rendered NodeMarker component.
 */

import { Marker, Popup, Polyline, useMap } from 'react-leaflet';
import pointImg from '../../assets/point.png';
import { use, useEffect } from 'react';

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
      {Object.entries(node.neighbors || {}).map(([key,value],neighborIndex) => (
        <Polyline
          key={`${index}-${neighborIndex}`}
          positions={[node.coords, nodes[key].coords]}
          color="red"
        />
      ))}
      <Marker
        key={index}
        icon={pointIcon}
        position={node.coords}
        eventHandlers={{
          click: () => {
            if (neighborUI) onAddNeighbor(name);
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
            <button onClick={() => onSetNeighbors(name)}>Set Neighbors</button><br></br>
            <button onClick={(e) => { onRemoveNodes(); e.stopPropagation(); }}>
              Delete All Nodes
            </button>
          </Popup>
        )}
      </Marker>
    </>
  );
}

export default NodeMarker;