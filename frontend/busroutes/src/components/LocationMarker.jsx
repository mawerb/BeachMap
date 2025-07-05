import { useMapEvents } from 'react-leaflet';
import { useRef, useEffect } from 'react';
import NodeMarker from './NodeMarker';
import { useNodeManager } from './NodeManager';
import '../css/LocationMarker.css';

/** LocationMarker component handles the addition of nodes on the map, **/
function LocationMarker() {
  const {
    nodes,
    addNode,
    removeAllNodes,
    neighborUI,
    setNeighborsMode,
    endNeighborsMode,
    handleUpdateGraph,
    updated,
    activeNode,
    handleAddNeighbor,
    handleUpdateName,
    handleRemoveNode,
  } = useNodeManager();

  const popupRefs = useRef({}); // Store references to popups for each node

  // Handle map events for adding nodes
  const map = useMapEvents({
    click(e) { // Set updated to true on change
      if (neighborUI) return;
      addNode(e.latlng);
    },
  }); 

  // Disable click propagation for the update graph button
  useEffect(() => {
    const button = document.getElementById('updateGraph');
    if (button) {
      L.DomEvent.disableClickPropagation(button);
    }
  }, []);

  // Handle Escape key to exit neighbors mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && neighborUI) {
        endNeighborsMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [neighborUI, endNeighborsMode]);

  return (
    <>
      {neighborUI && (
        <button onClick={endNeighborsMode} id='endNeighbor'>
          Stop Attaching Neighbors
        </button>
      )}
      { !updated && (
        <button onClick={(e) => {handleUpdateGraph(); e.stopPropagation()}} id='updateGraph'>
          Update Graph
        </button>
      )}
      {Object.entries(nodes).length > 0 && (Object.entries(nodes).map(([name,node], index) => (
        <NodeMarker
          key={index}
          name={name}
          node={node}
          index={index}
          nodes={nodes}
          neighborUI={neighborUI}
          onSetNeighbors={setNeighborsMode}
          onRemoveNodes={removeAllNodes}
          onRemoveNode={handleRemoveNode}
          onAddNeighbor={handleAddNeighbor}
          onChangeName={handleUpdateName}
          popupRefs={popupRefs}
        />
      ))
      )}
    </>
  );
}

export default LocationMarker;