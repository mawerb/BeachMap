import { useState, useEffect } from 'react'
import busLogo from '/favicon.png'
import Map from '../components/AdminMap'
import DropDown from '../components/Dropdown'
import { getOptions, findOptRoute } from '../services/api';

function PathFinder() {
  const[start,setStart] = useState('');
  const[end,setEnd] = useState('');
  const [options,setOptions] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null)
  const [route,setRoute] = useState(null)

  

  return (
    <>
      <div className="leaflet-map">
        <Map/>
      </div>
    </>
  )
}

export default PathFinder
