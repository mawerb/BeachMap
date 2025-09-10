import { useState, useEffect } from 'react'
import Map from '../components/PathFinder/Map'
import SideBarManager from '../components/SideBar/SideBarManager';
import Navbar from '../components/NavBar';
import InfoBar from "../components/SideBar/InfoBar";
import { getOptions, findOptRoute } from '../services/api';

function PathFinder() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [route, setRoute] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null);

  const validate = (newStart, newEnd) => {
    if (newStart && newEnd && newStart === newEnd) {
      setError("Start and endpoint must be different.");
      return false;
    }
    setError("");
    return true;
  }

  const handleStartChange = (e) => {
    const val = e.target.value;
    if (!validate(val, end)) {
      setEnd(start);
    }
    setStart(val)
  }

  const handleEndChange = (e) => {
    const val = e.target.value;
    if (!validate(start, val)) {
      setStart(end);
    }
    setEnd(val)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (loading) return;

    setLoading(true);

    try {
      const optimalRoute = await findOptRoute(start, end);
      setRoute(optimalRoute)
    } catch (err) {
      console.log(err)
      setError("Failed to load optimal path ...")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const opts = await getOptions();
        setOptions(opts)
      }
      catch (err) {
        console.log(err)
        setError('Failed to load options ...')
      }
      finally {
        setLoading(false)
      }
    }
    loadOptions()
  }, [])

  function setSelectedNodeByName(name) {
    console.log('name:', name)
    const node = options.find(node => node.name === name);
    console.log('node:', node)
    if (node) {
      setSelectedNode(node);
    } else {
      alert(`Node with name ${name} not found.`);
      console.error(`Node with name ${name} not found.`);
    }
  }

  return (
      <div className="overflow-hidden">
        {/* <form onSubmit={handleSearch}>
        <DropDown options={options} value={start} oppValue={end} setValue={handleStartChange} placeholder={"Select A Start"}/>
        <DropDown options={options} value={end} oppValue={start} setValue={handleEndChange} placeholder={"Select A Destination"}/>
        <button type="submit">Submit</button>
      </form> */}
        <Navbar />
        <div id="root">
          <div className="leaflet-map">
            <Map routeData={route}
              nodes={options}
              setNodes={setOptions}
              loading={loading}
              setLoading={setLoading}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              error={error}
              setError={setError} />
          </div>
          <SideBarManager LandMarks={options} selectedNode={selectedNode} setSelectedNode={setSelectedNode} setSelectedNodeByName={setSelectedNodeByName} />
        </div>
      </div>
  )
}

export default PathFinder
