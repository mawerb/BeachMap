import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import '../../css/Map.css'
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker'

function Map(){
    
    return (
        <div className='leaflet-map'>
            <MapContainer center={[33.78184042460368,-118.11463594436647]} zoom={15.7} scrollWheelZoom={true} maxZoom={20} minZoom={1} zoomControl= {false}>
                <LocationMarker />
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
            </MapContainer>
        </div>
    )
}

export default Map