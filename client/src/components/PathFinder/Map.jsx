import { MapContainer, TileLayer, Polyline, useMap, ZoomControl, LayersControl, } from 'react-leaflet'
import { useEffect, useState, useRef } from 'react'
import NodeLoader from './NodeLoader'
import RecenterButton from './RecenterButton'
import { filterNodesByEvent } from '../../services/api'
import '../../css/Map.css'
import 'leaflet/dist/leaflet.css';

function FitBounds({ coords }) {
    const map = useMap();

    useEffect(() => {
        if (coords && coords.length > 0) {
            map.flyToBounds(coords);
        }
    }, [coords, map]);

    return null;
}

function Map({
    routeData,
    nodes,
    setNodes,
    loading,
    setLoading,
    selectedNode,
    setSelectedNode,
    error,
    setError,
}) {
    const [nodesWithEvents, setNodesWithEvents] = useState([]);
    let coords = null;

    if (routeData) {
        coords = routeData.map(coord => coord[1])
    }

    return (
        <div className='leaflet-map'>
            <MapContainer 
            ref={mapRef}
            center={[33.78184042460368, -118.11463594436647]} 
            zoom={16} scrollWheelZoom={true} 
            maxZoom={22}
            minZoom={15} 
            zoomControl={false}
            whenReady={(map) => {
                map.target.invalidateSize();
            }}
            >
                {coords && coords.length > 0 &&
                    <>
                        <Polyline positions={coords} color='blue' />
                        <FitBounds coords={coords} />
                    </>
                }
                <TileLayer
                    attribution='Mapbox'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    detectRetina={false}
                    maxNativeZoom={19}
                    noWrap={false}
                    opacity={1}
                    subdomains={"abc"}
                    tms={false}
                    maxZoom={20}
                    keepBuffer={10}
                />
                <ZoomControl position="bottomright" />
                <LayersControl position="bottomright">
                    <NodeLoader
                        nodes={nodes}
                        setNodes={setNodes}
                        loading={loading}
                        setLoading={setLoading}
                        selectedNode={selectedNode}
                        setSelectedNode={setSelectedNode}
                        error={error}
                        setError={setError}
                        nodesWithEvents={nodesWithEvents}
                    />
                </LayersControl>
                <RecenterButton />
            </MapContainer>
        </div>
    )
}

export default Map