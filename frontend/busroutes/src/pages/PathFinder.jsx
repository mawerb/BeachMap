import { useState, useEffect } from 'react'
import Map from '../components/Map'
import DropDown from '../components/SideBar/Dropdown'
import Navbar from '../components/NavBar';
import InfoBar from "../components/SideBar/InfoBar";
import { getOptions, findOptRoute } from '../services/api';

function PathFinder() {
  const[start,setStart] = useState('');
  const[end,setEnd] = useState('');
  const [options,setOptions] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null)
  const [route,setRoute] = useState(null)

  const validate = (newStart,newEnd) => {
    if(newStart && newEnd && newStart === newEnd) {
      setError("Start and endpoint must be different.");
      return false;
    }
    setError("");
    return true;
  }

  const handleStartChange = (e) => {
    const val = e.target.value;
    if (!validate(val,end)) {
      setEnd(start);
    } 
    setStart(val)
  }

  const handleEndChange = (e) => {
    const val = e.target.value;
    if (!validate(start,val)) {
      setStart(end);
    }
    setEnd(val)
  }

  const handleSearch = async(e) => {
    e.preventDefault()
    if (loading) return;

    setLoading(true);

    try {
      const optimalRoute = await findOptRoute(start,end);
      setRoute(optimalRoute)
    } catch(err) {
      console.log(err)
      setError("Failed to load optimal path ...")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadOptions = async () => {
     try{
         const opts = await getOptions();
         setOptions(opts)
     } 
     catch(err) {
         console.log(err)
         setError('Failed to load options ...')
     }
     finally {
         setLoading(false)
     }
    } 
    loadOptions()
  }, [])

  return (
    <>
      {/* <form onSubmit={handleSearch}>
        <DropDown options={options} value={start} oppValue={end} setValue={handleStartChange} placeholder={"Select A Start"}/>
        <DropDown options={options} value={end} oppValue={start} setValue={handleEndChange} placeholder={"Select A Destination"}/>
        <button type="submit">Submit</button>
      </form> */}
      <Navbar/>
      <DropDown/>
      <InfoBar/>
      <div id="root">
        <div className="leaflet-map">
          <Map routeData ={route}/>
        </div>
      </div>
    </>
  )
}

export default PathFinder
