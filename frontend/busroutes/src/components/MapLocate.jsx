import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import '../css/Map.css'
import 'leaflet/dist/leaflet.css';

function LocationMarker(){
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
        click(e) {
            alert(`Lat: ${e.latlng.lat}, Lng:${e.latlng.lng}`)
            setPosition(e.latlng)
        },
    })
    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default LocationMarker