/**
 * NodeManager.js Custom hook for managing nodes in a graph-like structure.
 *
 * @returns {Object} An object containing the following properties:
 * @property {Object} nodes - The current state of nodes, where each key is a node name and the value is an object containing coordinates and neighbors.
 * @property {Function} addNode - Function to add a new node with specified coordinates and an optional name.
 * @property {Function} removeAllNodes - Function to remove all nodes and reset the state.
 * @property {boolean} neighborUI - Boolean indicating whether the neighbor UI is active.
 * @property {Function} setNeighborsMode - Function to set the active node and enable neighbor UI.
 * @property {Function} endNeighborsMode - Function to disable neighbor UI and reset the active node.
 * @property {Function} handleUpdateGraph - Function to trigger an update in the graph state.
 * @property {boolean} updated - Boolean indicating whether the graph has been updated.
 * @property {string|null} activeNode - The name of the currently active node, or null if none is active.
 * @property {Function} handleAddNeighbor - Function to add a neighbor to the currently active node.
 * @property {Function} handleUpdateName - Function to update the name of a node.
 * @property {Function} handleRemoveNode - Function to remove a specified node from the graph.
 */


/* quick changelog:
* - Added `handleUpdateName` to update node names.
* - Added `handleRemoveNode` to remove a specific node.
* - Added `handleAddNeighbor` to add a neighbor to the currently active node.
* - Added `handleUpdateGraph` to update the nodes in the backend.

NOTES:
* - Fix distance calcuation in `addNeighbor` function.
* - Fix DOM click propagation for the update graph button.
* - Hello jules in case ur seeing this
*/
import { useState,useEffect, act } from 'react';
import { getNodes,updateNodes } from '../../services/api.js';

export function useNodeManager() {
  const [nodes, setNodes] = useState({});
  const [activeNode, setActiveNode] = useState(null);
  const [neighborUI, setNeighborUI] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const loadedNodes = async () => {
      try {
        const data = await getNodes();
        if (data) {
          setNodes(data);
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
      }
    } 
    loadedNodes();
  }, []);

  // Function to add a new node with coordinates and an optional name
  const addNode = (coords, name="unNamed Node") => {
    setNodes(nodes => ({...nodes, [name]: { coords : [coords.lat,coords.lng], neighbors: {} }}));
  };

  // Function to handle updating the name of a node
  const handleUpdateName = (currName, newName) => {
    if (newName in nodes) {
      return alert('This name already exists. Please choose a different name.');
    }
    setNodes(nodes => (updateName(currName,newName)));
  }

  // Function to update the name of a node
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

  // Function to remove all nodes and reset the state
  const removeAllNodes = () => {
    setNodes({});
    setActiveNode(null);
    setNeighborUI(false);
  };

  // Function to remove a node and its references from neighbors
  const handleRemoveNode = (nodeName) => {
    setNodes(nodes => (removeNode(nodeName)));
  };

  const removeNode = (nodeName) => {
    return Object.entries(nodes).reduce((acc, [key, value]) => {
      if (key != nodeName) {
        if (value.neighbors[nodeName]) {
          // Remove the neighbor reference from the neighbors of this node
          const updatedNeighbors = { ...value.neighbors };
          delete updatedNeighbors[nodeName];
          acc[key] = { ...value, neighbors: updatedNeighbors };
        } else {
          // If no neighbor reference, just copy the node
          acc[key] = value;
        }
      }
      return acc
    }, {})
  }

  const setNeighborsMode = (name) => {
    setActiveNode(name);
    setNeighborUI(true);
  };

  const endNeighborsMode = () => {
    setActiveNode(null);
    setNeighborUI(false);
  };

  const handleUpdateGraph = async () => {
    if (updated) return;
      setUpdated(true);
    try {
      await updateNodes(nodes)
    } catch (err) {
      console.error('Error updating nodes:', err);
      alert('Failed to update nodes. Please try again later.');
    } finally {
      setUpdated(false)
    }
  };

  const addNeighbor = (name) => {
    const node = nodes[name];
    const activeNodeObj = nodes[activeNode];
    const distance = Math.sqrt((activeNodeObj.coords[0]-node.coords[1])**2 + (activeNodeObj.coords[0]-node.coords[1])**2);

    if (activeNodeObj === null || name === activeNode) return nodes;

    if (!activeNodeObj || !node) return nodes;

    if (activeNodeObj.neighbors[name]) {
      alert('This node is already a neighbor.');
      return nodes;
    }

    return {
      ...nodes,
      [activeNode]: {
        ...activeNodeObj,
        neighbors: {
          ...activeNodeObj.neighbors,
          [name] : {
            distance : distance,
          }
        }
      },
      [name]: {
        ...node,
        neighbors: {
          ...node.neighbors,
          [activeNode] : {
            distance : distance,
          }
        }
      }
    };
  };

  const handleAddNeighbor = (node) => {
    setNodes(currentNodes => addNeighbor(node));
  };

  console.log(nodes)

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