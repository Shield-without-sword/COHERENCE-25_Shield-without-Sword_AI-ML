// pages/LandingPage.jsx
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Employee Manager</h1>
      <p className="mb-8">Manage your team efficiently</p>
      <div className="space-x-4">
        <Button onClick={() => navigate('/login')}>Get Started</Button>
      </div>
    </div>
  )
}