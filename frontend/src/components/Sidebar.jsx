import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Users, LayoutDashboard, UserPlus, LogOut } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react';

const Navbar = () => {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(64); // Default height
  const navigate = useNavigate();
  const location = useLocation(); // You were missing this

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
      // Communicate navbar height to parent component if needed
      document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }
  }, [navbarHeight]);

  const isActive = (path) => location.pathname.includes(path);

  const menuItems = [
    {
      title: 'Job Listings',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/jobs'
    },
    {
      title: 'Candidate Directory',
      icon: <UserPlus className="h-5 w-5" />,
      path: '/feature'
    },
    // {
    //   title: 'Statistics',
    //   icon: <Users className="h-5 w-5" />,
    //   path: '/statistics'
    // },
    {
      title: 'Future Predictions',
      icon: <Users className="h-5 w-5" />,
      path: '/futurePrediction'
    }
  ]

  return (
    <div ref={navbarRef} className="w-full bg-slate-900 text-white py-4 shadow-lg fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold">Resume AI</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex space-x-6">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className={`flex items-center space-x-2 ${isActive(item.path) ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-800'}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.title}</span>
            </Button>
          ))}
        </nav>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-slate-800"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

export default Navbar