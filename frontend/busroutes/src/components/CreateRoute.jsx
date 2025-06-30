import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css';

function CreateRoute(routeData) {
    const [routes,setRoutes] = useState([])
    const [markers, setMarkers] = useState([])

    map = useMap()

    const coords = routeData.map(node => node[1])
    const points = routeData.map(node => node[0])

    var route = L.polyline(coords, {color:'blue'}).addTo(map)
    setRoutes(prev => [...prev, route])

    for (let i=0; i < coords.length; i++) {
        var marker = L.marker[coords[i]].addTo(map)
        marker.bindPopup(points[i])
        setMarkers(prev => [...prev,marker])
    }
}