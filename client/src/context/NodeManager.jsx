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
import { useState, useEffect, createContext, useContext } from 'react';
import { getNodes, updateNodes, uploadImage } from '../services/api.js';
import { set } from 'zod';

const NodeContext = createContext();

export function NodeProvider({ children }) {
  const [nodes, setNodes] = useState({});
  const [activeNode, setActiveNode] = useState(null);
  const [neighborUI, setNeighborUI] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const property_list = {
    isLandmark: false,
    isAccessible: false,
  }

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
  const addNode = (coords, name = "unNamed Node") => {
    let newNode = {
      [name]: {
        coords: [coords.lat, coords.lng], neighbors: {},
        properties: { ...property_list }, image: null,
      }
    };
    setNodes(nodes => ({ ...nodes, ...newNode }));
    setSelectedNode({ name, ...newNode[name] });
  };

  const handlePropChange = async (name, newProperties, newImage) => {
    if (loading) return;

    console.log('Updating properties for node:', name, newProperties);
    console.log('New image:', newImage);
    let image = null

    if(newImage) {
      if (newImage.name != name) {
        const image_ext = newImage.name.split('.').pop();
        newImage = new File([newImage], `${name}.${image_ext}` , { type: newImage.type });
      }
      const formData = new FormData();
      formData.append('image', newImage);
      image = await uploadImage(formData)
    }
    setLoading(true);
    setNodes(nodes => ({
      ...nodes,
      [name]: {
        ...nodes[name],
        properties: { ...newProperties },
        image,
      }
    }));
    setLoading(false);
  };

  // Function to handle updating the name of a node
  const handleUpdateName = (currName, newName, currNode) => {
    if (newName in nodes) {
      return alert('This name already exists. Please choose a different name.');
    }
    if (currName === selectedNode?.name) {
      setSelectedNode({ name: newName, node: currNode });
    }
    setNodes(nodes => (updateName(currName, newName)));
  }

  // Function to update the name of a node
  const updateName = (currName, newName) => {
    return Object.entries(nodes).reduce((acc, [key, value]) => {
      if (key === currName) {
        acc[newName] = value;
      }
      else {
        if (currName in value.neighbors) {
          const { [currName]: removed, ...restNeighbors } = value.neighbors;
          acc[key] = {
            ...value, neighbors: {
              ...restNeighbors,
              [newName]: removed,
            }
          }
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {})
  };

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
    if (updated || loading) return;
    setUpdated(true);
    setLoading(true);
    try {
      await updateNodes(nodes)
    } catch (err) {
      console.error('Error updating nodes:', err);
      alert('Failed to update nodes. Please try again later.');
    } finally {
      setUpdated(false)
      setLoading(false);
    }
  };

  const addNeighbor = (name) => {
    const node = nodes[name];
    const activeNodeObj = nodes[activeNode];

    const lat1 = activeNodeObj.coords[0];
    const lon1 = activeNodeObj.coords[1];
    const lat2 = node.coords[0];
    const lon2 = node.coords[1];

    const milesPerLat = 69;
    const milesPerLon = 69 * Math.cos((lat1 + lat2) / 2 * Math.PI / 180);

    const dx = (lat2 - lat1) * milesPerLat;
    const dy = (lon2 - lon1) * milesPerLon;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);

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
          [name]: {
            distance: distance,
          }
        }
      },
      [name]: {
        ...node,
        neighbors: {
          ...node.neighbors,
          [activeNode]: {
            distance: distance,
          }
        }
      }
    };
  };

  const handleAddNeighbor = (node) => {
    setNodes(currentNodes => addNeighbor(node));
  };

  const removeNeighbor = (nodeName, neighborName) => {
    return Object.entries(nodes).reduce((acc, [key, value]) => {
      if (key == nodeName) {
        // Remove the neighbor reference from the neighbors of this node
        const updatedNeighbors = { ...value.neighbors };
        delete updatedNeighbors[neighborName];
        acc[key] = { ...value, neighbors: updatedNeighbors };
      } else if (key == neighborName) {
        // Remove the node reference from the neighbors of the neighbor node
        const updatedNeighbors = { ...value.neighbors };
        delete updatedNeighbors[nodeName];
        acc[key] = { ...value, neighbors: updatedNeighbors };
      } else {
        // If no neighbor reference, just copy the node
        acc[key] = value;
      }
      return acc
    }
      , {})
  }

  const handleRemoveNeighbor = (nodeName, neighborName) => {
    setNodes(currentNodes => removeNeighbor(nodeName, neighborName))
  };

  return (
    <NodeContext.Provider value={{
      nodes,
      addNode,
      removeAllNodes,
      neighborUI,
      handlePropChange,
      setNeighborsMode,
      endNeighborsMode,
      handleUpdateGraph,
      loading,
      updated,
      activeNode,
      handleAddNeighbor,
      handleRemoveNeighbor,
      handleUpdateName,
      handleRemoveNode,
      selectedNode,
      setSelectedNode,
    }}>
      {children}
    </NodeContext.Provider>
  );
}

export function useNodeManager() {
  return useContext(NodeContext);
}