import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  GraduationCap, 
  Plus, 
  Calendar,
  Bookmark,
  Award,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Static filler jobs for empty state or during loading
  const fillerJobs = [
    {
      _id: 'filler-1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA (Remote)',
      experience_level: 'Senior',
      created_at: new Date().toISOString(),
      isFiller: true
    },
    {
      _id: 'filler-2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      experience_level: 'Mid-level',
      created_at: new Date().toISOString(),
      isFiller: true
    },
    {
      _id: 'filler-3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Austin, TX (Hybrid)',
      experience_level: 'Junior',
      created_at: new Date().toISOString(),
      isFiller: true
    },
    {
      _id: 'filler-4',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Chicago, IL',
      experience_level: 'Mid-level',
      created_at: new Date().toISOString(),
      isFiller: true
    },
    {
      _id: 'filler-5',
      title: 'Data Scientist',
      department: 'Data & Analytics',
      location: 'Seattle, WA (Remote)',
      experience_level: 'Senior',
      created_at: new Date().toISOString(),
      isFiller: true
    },
    {
      _id: 'filler-6',
      title: 'Customer Success Manager',
      department: 'Customer Support',
      location: 'Denver, CO',
      experience_level: 'Mid-level',
      created_at: new Date().toISOString(),
      isFiller: true
    },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  const handleCreateJobClick = () => {
    navigate('/jobs/create');
  };

  const handleJobClick = (jobId) => {
    if (jobId.startsWith('filler-')) {
      // For filler jobs, just show create job page instead of navigating to a non-existent job
      navigate('/jobs/create');
    } else {
      navigate(`/jobs/${jobId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-blue-600" />
            Job Listings
          </h1>
          <Button 
            onClick={handleCreateJobClick}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2"
          >
            <Plus size={18} />
            Create New Job
          </Button>
        </div>
        
        {/* Stats Section during loading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Jobs</p>
                  <p className="text-2xl font-bold text-blue-800">24</p>
                </div>
                <Briefcase className="h-10 w-10 text-blue-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Candidates</p>
                  <p className="text-2xl font-bold text-blue-800">186</p>
                </div>
                <Users className="h-10 w-10 text-blue-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Time to Fill (Avg)</p>
                  <p className="text-2xl font-bold text-blue-800">14 days</p>
                </div>
                <Clock className="h-10 w-10 text-blue-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-pulse grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fillerJobs.map((job, index) => (
            <Card
              key={`loading-${index}`}
              className="border-0 shadow-md overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-blue-300 to-indigo-300 border-b">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <div className="h-6 w-48 bg-white/40 rounded"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-slate-700">
                    <Building size={16} className="text-blue-500" /> 
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} className="text-blue-500" /> 
                    <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <GraduationCap size={16} className="text-blue-500" /> 
                    <div className="h-6 w-24 bg-blue-50 rounded"></div>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Calendar size={14} className="text-blue-500" />
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-white rounded border border-slate-200"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Display actual jobs or filler jobs if there are none
  const displayJobs = jobs.length > 0 ? jobs : fillerJobs;

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-blue-600" />
          Job Listings
        </h1>
        <Button 
          onClick={handleCreateJobClick}
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Job
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-md border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-800">{jobs.length > 0 ? jobs.length : '24'}</p>
              </div>
              <Briefcase className="h-10 w-10 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Candidates</p>
                <p className="text-2xl font-bold text-blue-800">186</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Time to Fill (Avg)</p>
                <p className="text-2xl font-bold text-blue-800">14 days</p>
              </div>
              <Clock className="h-10 w-10 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Engineering (12)
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Design (5)
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Marketing (3)
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Product (4)
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Sales (7)
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm cursor-pointer transition-colors">
            Customer Support (2)
          </Badge>
        </div>
      </div>

      {jobs.length === 0 ? (
        <>
          <div className="text-center bg-white p-8 rounded-xl border border-blue-100 shadow-lg mb-8">
            <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <p className="text-xl text-slate-700 mb-6">No jobs have been created yet.</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2 mx-auto py-6 px-8 text-lg font-medium"
              onClick={handleCreateJobClick}
            >
              <Plus size={20} />
              Create Your First Job
            </Button>
          </div>
          
          {/* Sample Jobs Section when no real jobs exist */}
          <div>
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-blue-600" />
              Sample Job Listings
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fillerJobs.map((job) => (
                <Card
                  key={job._id}
                  className="hover:shadow-xl transition-all duration-500 hover:translate-y-1 transform cursor-pointer border-0 shadow-md overflow-hidden"
                  onClick={() => handleJobClick(job._id)}
                >
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 bg-white">
                    <div className="space-y-4">
                      <p className="flex items-center gap-2 text-slate-700">
                        <Building size={16} className="text-blue-500" /> 
                        <span className="font-medium">{job.department}</span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <MapPin size={16} className="text-blue-500" /> 
                        <span>{job.location}</span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <GraduationCap size={16} className="text-blue-500" /> 
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {job.experience_level}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job._id);
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card
              key={job._id}
              className="hover:shadow-xl transition-all duration-500 hover:translate-y-1 transform cursor-pointer border-0 shadow-md overflow-hidden"
              onClick={() => handleJobClick(job._id)}
            >
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {job.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-slate-700">
                    <Building size={16} className="text-blue-500" /> 
                    <span className="font-medium">{job.department || 'Department Not Specified'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} className="text-blue-500" /> 
                    <span>{job.location || 'Location Not Specified'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <GraduationCap size={16} className="text-blue-500" /> 
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {job.experience_level || 'Experience Not Specified'}
                    </Badge>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Calendar size={14} className="text-blue-500" />
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobClick(job._id);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;