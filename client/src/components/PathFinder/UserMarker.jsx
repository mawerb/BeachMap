import React, { useState, useEffect, useRef } from 'react';
import { useMap, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Icon, latLng, point } from "leaflet";
import pointImg from '../../assets/point1.png'
import L from 'leaflet';

function UserMarker({
    position,
    setPosition
}) {
    const map = useMap();
    const intervalRef = useRef()

    const pointIcon = L.icon({
        iconUrl: pointImg,
        iconSize: [20, 20]
    });

    useEffect(() => {
        let initialLoad = true;

        const handleLocationFound = (e) => {
            setPosition(e.latlng);
            console.log("Updated location to:", e.latlng)

            if (initialLoad) {
                map.flyTo(e.latlng, map.getZoom());
                initialLoad = false
            }
        }

        const handleLocationError = (e) => {
            console.error("Location error:", e.message);
        }

        map.on('locationfound', handleLocationFound);
        map.on('locationerror', handleLocationError);

        map.locate();

        intervalRef.current = setInterval(() => {
            map.locate();
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
            map.off('locationfound', handleLocationFound);
            map.off('locationerror', handleLocationError);
        }

    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={pointIcon}>
            <Popup>
                <p className="font-bold">You are here</p>
            </Popup>
        </Marker>
    )
} export default UserMarker