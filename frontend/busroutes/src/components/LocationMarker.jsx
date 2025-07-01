import { useMapEvents } from 'react-leaflet';
import { useRef, useEffect } from 'react';
import NodeMarker from './NodeMarker';
import { useNodeManager } from './useNodeManager';

function LocationMarker() {
  const {
    nodes,
    addNode,
    removeAllNodes,
    neighborUI,
    setNeighborsMode,
    endNeighborsMode,
    activeNode,
    handleAddNeighbor,
  } = useNodeManager();

  const popupRefs = useRef({});

  const map = useMapEvents({
    click(e) {
      if (neighborUI) return;
      addNode(e.latlng);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && neighborUI) {
        endNeighborsMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [neighborUI, endNeighborsMode]);

  if (nodes.length === 0) return null;

  return (
    <>
      {neighborUI && (
        <button onClick={endNeighborsMode} id="endNeighbor">
          Stop Attaching Neighbors
        </button>
      )}
      {nodes.map((node, index) => (
        <NodeMarker
          key={index}
          node={node}
          index={index}
          nodes={nodes}
          neighborUI={neighborUI}
          onSetNeighbors={setNeighborsMode}
          onRemoveNodes={removeAllNodes}
          onAddNeighbor={handleAddNeighbor}
          popupRefs={popupRefs}
        />
      ))}
    </>
  );
}

export default LocationMarker;