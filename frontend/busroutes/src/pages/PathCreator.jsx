import { useState, useEffect } from 'react'
import busLogo from '/favicon.png'
import Map from '../components/NodeCreator/AdminMap'
import DropDown from '../components/Dropdown'
import { getOptions, findOptRoute } from '../services/api';
import AdminNav from '../components/NodeCreator/AdminNav'
import { NodeProvider } from '../context/NodeManager';

function PathFinder() {
  const[start,setStart] = useState('');
  const[end,setEnd] = useState('');
  const [options,setOptions] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null)
  const [route,setRoute] = useState(null)



  return (
    <>
      <NodeProvider>
        <AdminNav/>
        <div className="leaflet-map">
          <Map/>
        </div>
      </NodeProvider>
    </>
  )
}

export default PathFinder
