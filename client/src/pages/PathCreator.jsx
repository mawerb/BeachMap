import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import Map from '../components/NodeCreator/AdminMap'
import AdminNav from '../components/NodeCreator/AdminNav';
import { NodeProvider } from '../context/NodeManager';
import LoaderSimple from '../components/LoadingSimple';

function PathCreator() {
  const [isVerified, setIsVerified] = useState(null)
  const token = localStorage.getItem('jwt-token');

  useEffect(() => {
    fetch('https://csulbroutesserver.fly.dev/auth/verify/', {
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
      <LoaderSimple text="Verifying Token..." />
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
