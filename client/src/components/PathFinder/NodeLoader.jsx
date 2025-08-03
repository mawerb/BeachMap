import { useState, useEffect } from 'react';
import { getOptions } from '../../services/api';
import NodeMarker from './NodeMarker';
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

    function setSelectedNodeByName(name) {
        console.log('name:', name)
        const node = nodes.find(node => node.name === name);
        console.log('node:', node)
        if (node) {
            setSelectedNode(node);
        } else {
            alert(`Node with name ${name} not found.`);
            console.error(`Node with name ${name} not found.`);
        }
    }

    return (
        <>
            <SideBarManager LandMarks={nodes} selectedNode={selectedNode} setSelectedNode={setSelectedNode} setSelectedNodeByName={setSelectedNodeByName} />
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