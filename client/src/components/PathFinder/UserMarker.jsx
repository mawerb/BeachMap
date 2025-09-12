import React, { useState, useEffect, useRef } from 'react';
import { useMap, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Icon, latLng, point } from "leaflet";
import pointImg from '../../assets/point1.png'
import Modal from '@mui/material/Modal';
import L from 'leaflet';
import Typography from '@mui/material/Typography';

function UserMarker({
    position,
    setPosition,
    initialLoadRef
}) {
    const inCampusRef = useRef(true);
    const map = useMap();
    const intervalRef = useRef()
    const [showModal, setShowModal] = useState(false);

    const pointIcon = L.icon({
        iconUrl: pointImg,
        iconSize: [20, 20]
    });

    useEffect(() => {
        if (!inCampusRef.current) return;
        const campusCenter = window.innerWidth > 640 ? [33.78244042460368, -118.11463594436647] : [33.780899, -118.113119];

        const handleLocationFound = (e) => {

            if (e.latlng.distanceTo(campusCenter) > 900) {
                inCampusRef.current = false;
                map.stopLocate();
                setShowModal(true);
                return;
            }

            setPosition(e.latlng);
            console.log("Updated location to:", e.latlng)

            if (initialLoadRef.current) {
                map.flyTo(e.latlng, map.getZoom());
                initialLoadRef.current = false
            }
        }

        const handleLocationError = (e) => {
            console.error("Location error:", e.message);
        }

        map.on('locationfound', handleLocationFound);
        map.on('locationerror', handleLocationError);

        map.locate({ watch: true, enableHighAccuracy: true });

        return () => {
            map.stopLocate();
            map.off('locationfound', handleLocationFound);
            map.off('locationerror', handleLocationError);
        }

    }, [map]);

    return (
        <>
            {position && (
                <Marker position={position} icon={pointIcon}>
                    <Popup>
                        <p className="font-bold">You are here</p>
                    </Popup>
                </Marker>
            )}
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 z-[20000]
                                bg-[#b38102] p-4 rounded-lg md:p-6 shadow-2xl flex flex-col items-center 
                                space-y-2 md:space-y-4 w-[75%] max-w-2xl md:max-w-md">
                    <h2 className="text-sm md:text-xl font-bold text-white text-center">
                        Outside Campus Vicinity
                    </h2>
                    <p className="text-xs md:text-base text-gray-300 text-center">
                        You are currently outside the campus boundary.
                        Your location will not be tracked.
                    </p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer text-white text-xs md:text-base font-semibold px-4 py-2 rounded transition"
                    >
                        Got it
                    </button>
                </div>
            </Modal>
        </>
    )
} export default UserMarker