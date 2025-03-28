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

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <Button onClick={handleCreateJobClick}>
          Create New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center">
          <p>No jobs have been created yet.</p>
          <Button 
            className="mt-4" 
            onClick={handleCreateJobClick}
          >
            Create Your First Job
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card 
              key={job._id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleJobClick(job._id)}
            >
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{job.department}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {job.location || 'Location Not Specified'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {job.experience_level && `${job.experience_level} Level`}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;