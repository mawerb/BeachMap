import { MapContainer, TileLayer, Polyline, useMap, ZoomControl } from 'react-leaflet'
import { useEffect } from 'react'
import '../css/Map.css'
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

function Map({routeData}){
    let coords = null;

    if (routeData) {
        coords = routeData.map(coord => coord[1])
    }

    return (
        <div className='leaflet-map'>
            <MapContainer center={[33.78184042460368,-118.11463594436647]} zoom={15.7} scrollWheelZoom={true} maxZoom={20} minZoom={15} zoomControl={false}>
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
            </MapContainer>
        </div>
    )
}

export default Map