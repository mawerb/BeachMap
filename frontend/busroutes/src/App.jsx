import './css/App.css'
import PathFinder from './pages/PathFinder'
import PathCreator from './pages/PathCreator'
import {Routes, Route} from 'react-router-dom'
import Tester from './pages/test'

function App() {
    return(
        <Routes>
            <Route path="/admin" element={<PathCreator />} />
            <Route path="/" element={<PathFinder />} />
            <Route path="/test" element={<Tester/>} />
        </Routes>
    )
}

export default App