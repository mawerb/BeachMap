import { useState } from 'react';
import { set } from 'zod';

/* NodeManager.js - Manages nodes and their neighbors in a bus route application. */
export function useNodeManager() {
  const [nodes, setNodes] = useState({});
  const [activeNode, setActiveNode] = useState(null);
  const [neighborUI, setNeighborUI] = useState(false);
  const [updated, setUpdated] = useState(false);

  const addNode = (coords, name="unNamed Node") => {
    setNodes(nodes => ({...nodes, [name]: { coords, neighbors: {} }}));
  };

  const handleUpdateName = (currName, newName) => {
    if (newName in nodes) {
      return alert('This name already exists. Please choose a different name.');
    }
    setNodes(nodes => (updateName(currName,newName)));
  }

  const updateName = (currName, newName) => {
    return Object.entries(nodes).reduce((acc, [key,value]) => {
      if (key === currName) {
        acc[newName] = value;
      }
      else {
        acc[key] = value;
      }
      return acc;
    }, {})};

  const removeAllNodes = () => {
    setNodes({});
    setActiveNode(null);
    setNeighborUI(false);
  };

  const handleRemoveNode = (nodeName) => {
    setNodes(nodes => (removeNode(nodeName)));
  };

  const removeNode = (nodeName) => {
    return Object.entries(nodes).reduce((acc, [key, value]) => {
      if (key != nodeName) {
        acc[key] = value;
      }
      return acc
    }, {})
  }

  const setNeighborsMode = (index) => {
    setActiveNode(index);
    setNeighborUI(true);
  };

  const endNeighborsMode = () => {
    setActiveNode(null);
    setNeighborUI(false);
  };

  const handleUpdateGraph = () => {
    setUpdated(true);
  };

  const addNeighbor = (node) => {
    if (activeNode === null || index === activeNode) return nodes;

    neighbor_name = Object.keys(node);
    const activeNeighbors = activeNode.neighbors;

    if (activeNeighbors.neighbor_name) {
      alert('This node is already a neighbor.');
      return nodes;
    }

    return Object.entries(nodes).map((node, i) => {
      if (i === activeNode) {
        return {
          ...node,
          neighbors: {...node.neighbors, index},
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

  const handleAddNeighbor = (node) => {
    setNodes(currentNodes => addNeighbor(node));
  };

  return {
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
  };
}