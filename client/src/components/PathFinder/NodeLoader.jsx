import { useState, useEffect } from 'react';
import { getOptions } from '../../services/api';
import NodeMarker from './NodeMarker';
import { useMap } from 'react-leaflet';
import SideBarManager from '../SideBar/SideBarManager';

function NodeLoader({
    nodes,
    setNodes,
    loading,
    setLoading,
    selectedNode,
    setSelectedNode,
    setError,
}) {
    const curr_map = useMap();
    
    useEffect(() => {
        if (selectedNode) {
            const coords = selectedNode.coords;
            curr_map.flyTo([coords[0],coords[1]-0.0008], 18);
        }
    }, [selectedNode])

    return (
        <>
            {loading
                ? <p>Loading nodes...</p>
                :
                nodes.map((node, index) => {
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
        </>
    )
}

export default NodeLoader;