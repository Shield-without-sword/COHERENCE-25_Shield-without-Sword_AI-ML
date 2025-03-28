// pages/LoginPage.jsx
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  
  const handleLogin = (e) => {
    e.preventDefault()
    // For now, just redirect to dashboard
    navigate('/jobs')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="p-8 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input 
          type="email" 
          placeholder="Email"
          className="block w-full p-2 mb-4 border rounded" 
        />
        <input 
          type="password" 
          placeholder="Password"
          className="block w-full p-2 mb-4 border rounded" 
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  )
}