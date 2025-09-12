import { useState, useEffect } from 'react';
import { getOptions } from '../../services/api';
import NodeMarker from './NodeMarker';
import { useMap, LayersControl, LayerGroup } from 'react-leaflet';
import SideBarManager from '../SideBar/SideBarManager';

function NodeLoader({
    nodes,
    setNodes,
    loading,
    setLoading,
    selectedNode,
    setSelectedNode,
    setError,
    nodesWithEvents = [],
}) {
    const curr_map = useMap();

    const nodesToDisplay = nodes.filter(node => nodesWithEvents.includes(node.name));
    const nodesToHide = nodes.filter(node => !nodesWithEvents.includes(node.name));

    useEffect(() => {
        if (selectedNode) {
            const coords = selectedNode.coords;
            if(window.innerWidth > 640)
                curr_map.flyTo([coords[0], coords[1] - 0.0008], 18);
            else 
                curr_map.flyTo(coords, 18);
        }
    }, [selectedNode])

    return (
        loading
            ? <p>Loading nodes...</p>
            : (
                <>
                    <LayersControl.Overlay name="Landmarks with Events" checked>
                        <LayerGroup>
                            {nodesToDisplay.map((node, index) => {
                                return <NodeMarker
                                    key={index}
                                    node={node}
                                    name={node.name}
                                    coords={node.coords}
                                    properties={node.properties}
                                    image={node.image}
                                    setSelectedNode={setSelectedNode}
                                />
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Landmarks with no Events">
                        <LayerGroup>
                            {nodesToHide.map((node, index) => {
                                return <NodeMarker
                                    key={index}
                                    node={node}
                                    name={node.name}
                                    coords={node.coords}
                                    properties={node.properties}
                                    image={node.image}
                                    setSelectedNode={setSelectedNode}
                                />
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </>
            )
    )
}

export default NodeLoader;