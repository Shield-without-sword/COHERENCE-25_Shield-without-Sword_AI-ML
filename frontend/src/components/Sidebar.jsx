import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Users,
  LayoutDashboard,
  Menu,
  UserPlus,
  LogOut,
} from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname.includes(path)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard/employee'
    },
    {
      title: 'Feature1',
      icon: <UserPlus className="h-5 w-5" />,
      path: '/dashboard/feature'
    },
    {
      title: 'Statistics',
      icon: <Users className="h-5 w-5" />,
      path: '/dashboard/statistics'
    }
  ]

  return (
    <div className="relative">
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        min-h-screen bg-slate-900 text-white transition-all duration-300 p-4
      `}>
        {/* Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute -right-3 top-4 bg-slate-900 rounded-full hover:bg-slate-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4 text-white" />
        </Button>

        {/* Logo/Title */}
        <div className="flex items-center space-x-2 mb-8">
          <Users className="h-8 w-8 text-blue-500" />
          {!isCollapsed && <span className="text-xl font-bold">EMP Manager</span>}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={`
                w-full justify-start space-x-3 
                ${isActive(item.path) ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-800'}
              `}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
          ))}
        </nav>

        {/* Logout Button at Bottom */}
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 absolute bottom-4 hover:bg-slate-800"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar