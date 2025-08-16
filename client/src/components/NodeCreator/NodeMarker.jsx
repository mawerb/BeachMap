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
import { use, useEffect, useState } from 'react';
import NodePropertyEditor from './NodePropertyEditor';

function NodeMarker({
  name,
  node,
  index,
  nodes,
  selectedNode,
  setSelectedNode,
  neighborUI,
  onSetNeighbors,
  onRemoveNode,
  onAddNeighbor,
  onRemoveNeighbor,
  onChangeName,
  popupRefs,
  handlePropChange,
  handleUpdateGraph,
}) {
  const pointIcon = L.icon({
    iconUrl: pointImg,
    iconSize: [20, 30],
    iconAnchor: [7.5,23],
    popupAnchor: [2,-20],
  });

  const curr_map = useMap();

  // useEffect(() => {
  //   const popup = popupRefs.current[index];
  //   curr_map.openPopup(popup, node.coords);
  // },[popupRefs.current[index]]);

  useEffect(() => {
    if (popupRefs.current) {
      popupRefs.current.openPopup()
    }
  }, [popupRefs.current]);

  return (
    <>
      {Object.entries(node.neighbors || {}).map(([key,value],neighborIndex) => (
        <Polyline
          key={`${index}-${neighborIndex}`}
          positions={[node.coords, nodes[key].coords]}
          color="red"
        >
          <Popup>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded mr-2 transition"
            onClick={(e) => { onRemoveNeighbor(name,key); e.stopPropagation(); }}>
              Remove Connection
            </button>
          </Popup>
        </Polyline>
      ))}
      <Marker
        key={index}
        icon={pointIcon}
        position={node.coords}
        ref={popupRefs}
        eventHandlers={{
          click: () => {
            if (neighborUI) onAddNeighbor(name);
            else {
              setSelectedNode({ name, node });
            }
          },
        }}
      >
        {selectedNode && selectedNode.name === name && <NodePropertyEditor nodeName={name} property={node.properties} overview={node.overview} landmarkType={node.type} handlePropChange={handlePropChange} handleUpdateGraph={handleUpdateGraph}/>}
        {!neighborUI && (
          <Popup>
            <div className='montserrat font-semibold mb-2 truncate max-w-45'>Node {index + 1}: {name}</div>
            <input 
            className="border border-gray-300 rounded px-2 py-1 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text" 
            onKeyUp={(e) => {
              if (e.key === "Enter") {
              onChangeName(name,e.target.value,node)}
              }}></input><br/>
            <button 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded mr-2 transition"
            onClick={(e) => { onRemoveNode(name); e.stopPropagation(); }}>
              Delete
            </button>
            <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded transition"
            onClick={() => onSetNeighbors(name)}>Set Neighbors</button><br></br>
          </Popup>
        )}
      </Marker>
    </>
  );
}

export default NodeMarker;