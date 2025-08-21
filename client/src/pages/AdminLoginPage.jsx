import { useState } from "react"
import { useNavigate } from "react-router-dom"
import loginbg from '../assets/login-bg.jpeg'

export default function AdminLoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidPassword, setInvalidPassword] = useState(false)
    const navigate = useNavigate()

    function submitUser(event) {
        event.preventDefault()
        fetch('https://csulbroutesserver.fly.dev/auth/login/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'success') {
                    localStorage.setItem('jwt-token', data.token)
                    setUsername('')
                    setPassword('')
                    navigate('/admin/create_landmarks')
                } else {
                    setInvalidPassword(true)
                }
            })
    }
    return (
        <>
            <main className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('../assets/login-bg.jpeg')] bg-cover blur-md"></div>
                <div className="backdrop-blur-lg bg-gray-100/70 drop-shadow-lg border-gray-300 rounded-2xl p-10 flex flex-col">
                    <h1 className="text-xl m-auto font-bold">Admin Login </h1>
                    <br />
                    {invalidPassword && <h2 className="text-red-500">Invalid Password.</h2>}
                    <form onSubmit={submitUser}>
                        <div className="flex flex-col gap-4">
                        {/* Username field */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i className="fa fa-envelope"></i>
                            </span>
                            <input
                                value={username}
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Password field */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i className="fa fa-lock"></i>
                            </span>
                            <input
                                value={password}
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        </div>
                        <br/>
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 cursor-pointer transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}