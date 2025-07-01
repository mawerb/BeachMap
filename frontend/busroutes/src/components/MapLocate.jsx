import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvents, Polyline } from 'react-leaflet'
import { useState,useEffect,useRef } from 'react'
import '../css/Map.css'
import 'leaflet/dist/leaflet.css';
import pointUrl from '../assets/point.png'

function LocationMarker(){
    const [position, setPosition] = useState(null);
    const [popupOn, setpopupOn] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [neighborUI, setNeighborUI] = useState(false);
    const [activeNode, setActiveNode] = useState(null);
    const popupRefs = useRef({});

    let pointIcon = L.icon({
        iconUrl: pointUrl,
        iconSize: [8, 8],
    })

    const map = useMapEvents({
        add : () => setpopupOn(true),
        remove: () => setpopupOn(false),
        click(e) {
            if(popupOn) return;
            if(neighborUI) return;
            setPosition(e.latlng)
            setNodes(nodes => [...nodes, {'coords': e.latlng, 'neighbors': []}]);
        },
    })

    const handleRemoveNodes = () => {
        setNodes([]);
    }
    
    const handleSetNeighbors = (i) => {
        popupRefs.current[i].close();
        setActiveNode(i);
        setNeighborUI(true);
    }

    const handleEndNeighbors = () => {
        setNeighborUI(false);
        setActiveNode(null);
    }

    useEffect(() => {
        console.log('Neighbor UI state changed:', neighborUI);
        const handleKeyDown = (e) => {
            if(e.key === 'Escape' && neighborUI) {
                handleEndNeighbors();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [neighborUI])
    
    const handleAddNeighbors = (i) => {
        console.log(nodes[i])
        if (!neighborUI || activeNode === null) return;

        if (i === activeNode) {
            alert("Cannot add neighbors to itself.");
            return;
        }

        setNodes(nodes => {
            const currActiveNode = nodes[activeNode];
            const exists = currActiveNode.neighbors.some(neighbor => neighbor === i); 
            // Check if neighbor already exists (NOTE! Change conditional to .name in the future)

            if (exists) {
                alert("This node is already a neighbor.");
                return nodes;
            }

            const updatedNodes = nodes.map((node, index) => {
                if (index === activeNode) {
                    return{
                        ...node,
                        neighbors: [...node.neighbors, i]
                    }
                }
                if (index === i) {
                    return {
                        ...node,
                        neighbors: [...node.neighbors, activeNode]
                    }
                }
                return node;
            });
            return updatedNodes;
        })
    }

    useEffect(() => {
        console.log('Nodes updated:', nodes);
      }, [nodes]);

    return nodes.length === 0 ? null : (
        <>
            {neighborUI && <button onClick={handleEndNeighbors} id="endNeighbor">Stop Attaching Neighbors</button>}
            {nodes.map((node,index) => (
                node.neighbors.map((neighborIndex) => {
                    const neighborCoords = nodes[neighborIndex].coords;
                    return(
                    <Polyline positions={[node.coords, neighborCoords]} color='red' />
                    )
                })
            ))}
            {nodes.map((node, index) => (
                <Marker key={index} icon={pointIcon} position={node.coords} eventHandlers={{
                    click: () => {
                        console.log(`Node ${index + 1} clicked`);
                        if (neighborUI) {
                            handleAddNeighbors(index);
                        }
                    }
                }}>
                    {!neighborUI && (
                    <Popup ref={el => (popupRefs.current[index] = el)}>
                        <div>Node {index + 1}</div>
                        <button onClick={(e) => {handleRemoveNodes(); e.stopPropagation()}}>Delete</button>
                        <button onClick={() => handleSetNeighbors(index)}>Set Neighbors</button>
                    </Popup>)}
                </Marker>
            ))}
        </>
    )
}

export default LocationMarker