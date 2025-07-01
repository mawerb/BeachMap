import { useState } from 'react';

export function useNodeManager() {
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [neighborUI, setNeighborUI] = useState(false);

  const addNode = (coords) => {
    setNodes(nodes => [...nodes, { coords, neighbors: [] }]);
  };

  const removeAllNodes = () => {
    setNodes([]);
    setActiveNode(null);
    setNeighborUI(false);
  };

  const setNeighborsMode = (index) => {
    setActiveNode(index);
    setNeighborUI(true);
  };

  const endNeighborsMode = () => {
    setActiveNode(null);
    setNeighborUI(false);
  };

  const addNeighbor = (index) => {
    if (activeNode === null || index === activeNode) return nodes;

    const activeNeighbors = nodes[activeNode].neighbors;

    if (activeNeighbors.includes(index)) {
      alert('This node is already a neighbor.');
      return nodes;
    }

    return nodes.map((node, i) => {
      if (i === activeNode) {
        return {
          ...node,
          neighbors: [...node.neighbors, index],
        };
      }
      if (i === index) {
        return {
          ...node,
          neighbors: [...node.neighbors, activeNode],
        };
      }
      return node;
    });
  };

  const handleAddNeighbor = (index) => {
    setNodes(currentNodes => addNeighbor(index));
  };

  return {
    nodes,
    addNode,
    removeAllNodes,
    neighborUI,
    setNeighborsMode,
    endNeighborsMode,
    activeNode,
    handleAddNeighbor,
  };
}