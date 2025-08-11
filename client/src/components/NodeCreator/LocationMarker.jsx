/**
 * LocationMarker component handles the addition and management of nodes on the map.
 * It utilizes the react-leaflet library to interact with map events and manage node states.
 *
 * @component
 * @returns {JSX.Element} The rendered LocationMarker component.
 *
 * @hooks
 * @useNodeManager - Custom hook to manage nodes, including adding, removing, and updating nodes.
 * @useMapEvents - Hook from react-leaflet to handle map events such as clicks.
 *
 * @effects
 * - Adds a node to the map when clicked, unless in neighbor UI mode.
 * - Disables click propagation for the update graph button.
 * - Listens for the Escape key to exit neighbor mode.
 *
 * @props
 * - nodes {Object} - The current nodes in the graph.
 * - addNode {Function} - Function to add a new node.
 * - removeAllNodes {Function} - Function to remove all nodes.
 * - neighborUI {boolean} - Indicates if the neighbor UI is active.
 * - setNeighborsMode {Function} - Function to set the neighbors mode.
 * - endNeighborsMode {Function} - Function to exit the neighbors mode.
 * - handleUpdateGraph {Function} - Function to update the graph.
 * - updated {boolean} - Indicates if the graph has been updated.
 * - activeNode {Object} - The currently active node.
 * - handleAddNeighbor {Function} - Function to add a neighbor to a node.
 * - handleUpdateName {Function} - Function to update the name of a node.
 * - handleRemoveNode {Function} - Function to remove a specific node.
 */

import { useMapEvents } from 'react-leaflet';
import { useRef, useEffect } from 'react';
import NodeMarker from './NodeMarker';
import { useNodeManager } from '../../context/NodeManager';
import '../../css/LocationMarker.css';


function LocationMarker() {
  const {
    nodes,
    addNode,
    neighborUI,
    setNeighborsMode,
    endNeighborsMode,
    handleAddNeighbor,
    handleRemoveNeighbor,
    handleUpdateGraph,
    handleUpdateName,
    handleRemoveNode,
    selectedNode,
    setSelectedNode,
    handlePropChange

  } = useNodeManager();

  const popupRefs = useRef({}); // Store references to popups for each node
  const containerRef = useRef(null); // Reference to the container div

  useEffect(() => {
    if(containerRef.current) {
      containerRef.current.focus(); // Focus the container to enable keyboard events
    }
  }, [neighborUI])

  // Handle map events for adding nodes
  const map = useMapEvents({
    click(e) { // Set updated to true on change
      if (neighborUI) return;
      addNode(e.latlng);
    },
  }); 

  // Handle Escape key to exit neighbors mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        endNeighborsMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [neighborUI,endNeighborsMode]);

  return (
    <div tabIndex={0} ref={containerRef}>
      {neighborUI && (
        <button onClick={endNeighborsMode} id='endNeighbor'>
          Stop Attaching Neighbors
        </button>
      )}
      {Object.entries(nodes).length > 0 && (Object.entries(nodes).map(([name,node], index) => (
        // Render NodeMarker for each node in the nodes object
        <NodeMarker
          key={index}
          name={name}
          node={node}
          index={index}
          nodes={nodes}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          neighborUI={neighborUI}
          onSetNeighbors={setNeighborsMode}
          onRemoveNode={handleRemoveNode}
          onAddNeighbor={handleAddNeighbor}
          onRemoveNeighbor={handleRemoveNeighbor}
          onChangeName={handleUpdateName}
          popupRefs={popupRefs}
          handlePropChange={handlePropChange}
          handleUpdateGraph={handleUpdateGraph}
        />
      ))
      )}
    </div>
  );
}

export default LocationMarker;