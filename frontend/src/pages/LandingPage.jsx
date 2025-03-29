import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { FileText, Zap, BarChart, Shield } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  
  const features = [
    { 
      icon: <FileText className="w-6 h-6" />, 
      title: "NLP Resume Analysis", 
      description: "Extract key information from thousands of resumes instantly" 
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "ML-Powered Matching", 
      description: "Predict candidate-job fit based on historical hiring data" 
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: "Bias Detection", 
      description: "Ensure fair candidate selection with our advanced algorithms" 
    },
    { 
      icon: <BarChart className="w-6 h-6" />, 
      title: "Intuitive Dashboard", 
      description: "Visualize candidate rankings and make informed decisions" 
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
          <div className="lg:w-1/2 space-y-6 text-left">
            <div className="flex items-center mb-2">
              <div className="bg-purple-600 h-1 w-16 rounded mr-4"></div>
              <span className="text-purple-600 font-semibold">AI-POWERED RECRUITMENT</span>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              ResumeAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Screen thousands of resumes in minutes, not months
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI-powered platform analyzes resumes, predicts candidate-job fit, and ensures fair selection, 
              helping HR teams find the best talent efficiently.
            </p>
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => navigate('/jobs')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Sign In 
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-medium"
              >
                Log In
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-30"></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <div className="rounded-md overflow-hidden">
                  <div className="h-8 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 h-64 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 w-32 bg-purple-200 dark:bg-purple-900 rounded"></div>
                      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="col-span-3 grid grid-rows-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-indigo-200 dark:bg-indigo-900 rounded-full"></div>
                            <div className="h-6 flex-grow bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-16 bg-green-200 dark:bg-green-900 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12">
          {[
            { number: "85%", label: "Time Saved" },
            { number: "3x", label: "More Candidates Screened" },
            { number: "95%", label: "Accuracy Rate" },
            { number: "60%", label: "Reduced Hiring Bias" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-2xl font-bold text-center mb-4">How ResumeAI Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Our platform uses cutting-edge AI to transform your hiring process
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to revolutionize your hiring process?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Join hundreds of companies already using ResumeAI to find the best talent efficiently and fairly</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-white text-white hover:bg-purple-700 px-8 py-3 rounded-lg font-medium"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}