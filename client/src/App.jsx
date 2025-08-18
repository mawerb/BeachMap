import './css/App.css'
import PathFinder from './pages/PathFinder'
import PathCreator from './pages/PathCreator'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tester from './pages/test'
import AdminLoginPage from './pages/AdminLoginPage'

function App() {
    return (
        <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/create_landmarks" element={<PathCreator />} />
            <Route path="/" element={<PathFinder />} />
            <Route path="/test" element={<Tester />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    )
}

export default App