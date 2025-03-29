import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Lock, Mail, LogIn, UserCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, just redirect to dashboard
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-8">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b p-6 space-y-3">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-3 justify-center">
              <UserCheck className="h-8 w-8" />
              Recruiter Login
            </CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Sign in to access your recruitment dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8 p-6 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Mail size={18} className="text-blue-500" />
                  <label className="font-medium">Email Address</label>
                </div>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-blue-200 focus-visible:ring-blue-500 pl-3 py-6"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Lock size={18} className="text-blue-500" />
                  <label className="font-medium">Password</label>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="border-blue-200 focus-visible:ring-blue-500 pl-3 py-6"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t p-6">
            <Button 
              type="submit" 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 shadow-md"
            >
              <LogIn size={20} />
              Sign In
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}