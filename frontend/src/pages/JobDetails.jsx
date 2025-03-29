import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import emailjs from '@emailjs/browser';



const CandidateDetailsDialog = ({ candidate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract first name (assuming full name is in "First Last" format)
  const firstName = candidate.name.split(' ')[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{firstName}'s Candidate Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Match Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Match Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Match Percentage</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'default' : 
                        parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {candidate.match_result?.JD_Match || 'N/A'}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Missing Keywords Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Missing Keywords</h3>
            {candidate.match_result?.MissingKeywords?.length > 0 ? (
              <div className="space-y-2">
                {candidate.match_result.MissingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No missing keywords detected</p>
            )}
          </div>
        </div>

        {/* Profile Summary Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              {candidate.match_result?.Profile_Summary || 'No profile summary available'}
            </p>
          </div>
        </div>

        {/* Professional Details */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Current Role</TableCell>
                  <TableCell>{candidate.current_job_title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Education</TableCell>
                  <TableCell>{candidate.education}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => window.open(candidate.resume_url, '_blank')}
            >
              Download Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const { jobId } = useParams();

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      setJob(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setResumeFiles(Array.from(event.target.files));
  };

const [selectedCandidates, setSelectedCandidates] = useState([]);
const toggleCandidateSelection = (candidateId) => {
  setSelectedCandidates(prev =>
    prev.includes(candidateId)
      ? prev.filter(id => id !== candidateId)
      : [...prev, candidateId]
  );
};
  const toggleSelectAll = () => {
    if (selectedCandidates.length === job.candidates.length) {
      // If all are selected, deselect all
      setSelectedCandidates([]);
    } else {
      // Select all candidate IDs
      setSelectedCandidates(job.candidates.map(candidate => candidate._id));
    }
  };

  // Send email to selected candidates
  const sendEmailToSelectedCandidates = async () => {
    // Validate selection
    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate to send an email.");
      return;
    }
  
    try {
      // Filter selected candidates
      const selectedCandidateDetails = job.candidates.filter((candidate) =>
        selectedCandidates.includes(candidate._id)
      );
  
      // Send emails to each selected candidate
      const emailPromises = selectedCandidateDetails.map(async (candidate) => {
        return emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, // Your EmailJS service ID
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Your email template ID
          {
            candidate_name: candidate.name,
            candidate_email: candidate.email,
            job_title: job.title,
            company_name: job.company,
          },
          import.meta.env.VITE_EMAILJS_USER_ID // Your EmailJS user ID
        );
      });
  
      // Wait for all emails to be sent
      await Promise.all(emailPromises);
  
      // Show success message
      toast.success(`Emails sent to ${selectedCandidates.length} candidate(s).`);
  
      // Clear selection after sending
      setSelectedCandidates([]);
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("There was an error sending emails. Please try again.");
    }
  };
  const handleResumeUpload = async () => {
    if (resumeFiles.length === 0) {
      toast.warning('Please select files to upload');
      return;
    }

    const formData = new FormData();
    resumeFiles.forEach(file => {
      formData.append('resumes', file);
    });

    try {
      setUploadStatus('Uploading...');
      
      const response = await fetch(`http://127.0.0.1:5000/api/jobs/${jobId}/upload-resumes`, {
        method: 'POST',
        body: formData  // No need to set Content-Type, it will be set automatically
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const result = await response.json();

      toast.success(`Successfully uploaded ${result.uploaded_resumes.length} resumes`);
      setUploadStatus(`Uploaded ${result.uploaded_resumes.length} resumes`);
      
      // Refresh job details to show new candidates
      fetchJobDetails();
      
      // Clear file input
      setResumeFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload resumes');
      setUploadStatus('Upload failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p>{job.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Job Details</h3>
              <p>Department: {job.department}</p>
              <p>Location: {job.location || 'Not Specified'}</p>
              <p>Experience Level: {job.experience_level}</p>
              <p>Required Skills: {job.required_skills?.join(', ') || 'None specified'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <h3 className="font-semibold mb-4">Upload Candidate Resumes</h3>
            <div className="flex items-center space-x-4">
              <Input 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <Button 
                onClick={handleResumeUpload}
                disabled={resumeFiles.length === 0}
              >
                Upload Resumes
              </Button>
            </div>
            {uploadStatus && (
              <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
            )}
          </div>
        </CardFooter>
      </Card>

      {job.candidates && job.candidates.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ranked Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedCandidates.length === job.candidates.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all candidates"
                    />
                  </TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Match</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.candidates.map((candidate, index) => (
                  <TableRow key={candidate._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCandidates.includes(candidate._id)}
                        onCheckedChange={() => toggleCandidateSelection(candidate._id)}
                        aria-label={`Select ${candidate.name}`}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.name.split(' ')[0]}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'default' : 
                          parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {candidate.match_result?.JD_Match || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <CandidateDetailsDialog candidate={candidate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={sendEmailToSelectedCandidates}
              disabled={selectedCandidates.length === 0}
            >
              Send Email to {selectedCandidates.length} Candidate(s)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
export default JobDetails;