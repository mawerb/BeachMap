import './css/App.css'
import PathFinder from './pages/PathFinder'
import PathCreator from './pages/PathCreator'
import {Routes, Route} from 'react-router-dom'

function App() {
    return(
        <Routes>
            <Route path="/admin" element={<PathCreator />} />
            <Route path="/" element={<PathFinder />} />
        </Routes>
    )
}

export default App