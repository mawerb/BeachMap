import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import Map from '../components/NodeCreator/AdminMap'
import AdminNav from '../components/NodeCreator/AdminNav';
import { NodeProvider } from '../context/NodeManager';

function PathCreator() {
  const [isVerified, setIsVerified] = useState(null)
  const token = localStorage.getItem('jwt-token');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/auth/verify/', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsVerified(true);
          return;
        }
        if (res.status === 401) {
          console.log("Token invalid or expired")
          setIsVerified(false)
        }
        else {
          setIsVerified(false)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      })
  }, [])

  if (isVerified === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">Verifying token...</p>
        </div>
      </div>
    );
  }

  if (!token || !isVerified) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <>
      <NodeProvider>
        <AdminNav />
        <div className="leaflet-map h-screen overflow-hidden">
          <Map />
        </div>
      </NodeProvider>
    </>
  )
}

export default PathCreator
