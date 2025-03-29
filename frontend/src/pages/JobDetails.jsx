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
import { CircleCheckBig, FileUp, Mail, Download, Eye, Info, Briefcase, MapPin, Building, GraduationCap, Star, ChevronUp, ChevronDown, UserCheck, Award, BarChart } from 'lucide-react';

const CandidateDetailsDialog = ({ candidate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract first name (assuming full name is in "First Last" format)
  const firstName = candidate.name.split(' ')[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.href = `/candidates/${candidate._id}`}
        className="flex items-center gap-2 transition-all duration-300 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 hover:scale-105 shadow-sm hover:shadow ml-auto"
      >
        <Eye size={16} />
        View Profile
      </Button>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200 shadow-xl">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="text-xl flex items-centerF gap-2 text-blue-800">
            <UserCheck size={22} className="text-blue-600" />
            {firstName}'s Candidate Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Match Section */}
          <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
              <BarChart size={18} className="text-blue-500" />
              Job Match Analysis
            </h3>
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
                      className={`
                        text-sm px-3 py-1 animate-pulse ${
                          parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'bg-green-100 text-green-800 border-green-300' : 
                          parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                          'bg-red-100 text-red-800 border-red-300'
                        }
                      `}
                    >
                      {candidate.match_result?.JD_Match || 'N/A'}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Missing Keywords Section */}
          <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-700">
              <Info size={18} className="text-amber-500" />
              Missing Keywords
            </h3>
            {candidate.match_result?.MissingKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.match_result.MissingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-white hover:bg-amber-50 transition-colors duration-200 border-amber-200 text-amber-700">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CircleCheckBig size={18} />
                <p className="text-sm font-medium">No missing keywords detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
            <Info size={18} className="text-green-500" />
            Profile Summary
          </h3>
          <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
            <p className="text-sm leading-relaxed">
              {candidate.match_result?.Profile_Summary || 'No profile summary available'}
            </p>
          </div>
        </div>

        {/* Professional Details */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <Briefcase size={18} className="text-indigo-500" />
              Professional Details
            </h3>
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
          <div className="flex flex-col justify-center space-y-3 p-5 bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
            <Button 
              onClick={() => window.open(candidate.resume_url, '_blank')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 py-6 text-lg font-medium"
            >
              <Download size={20} />
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
        const templateParams = {
          to_email: candidate.email, // Candidate's email
          from_name: "HR Team", // Sender's name
          candidate_name: candidate.name,
          job_title: job.title,
          interview_date: candidate.interviewDate || "4th April 2025",
          interview_time: candidate.interviewTime || "11:00 AM",
          interview_location: candidate.interviewLocation || " Altimus, Level 39 & 40. Pandurang Budhkar Marg, Worli. Mumbai 400 018 · MUMBAI.",
          message: candidate.message || "We look forward to your participation.",
          current_job_title: candidate.current_job_title || "Not Provided",
          education: candidate.education || "Not Provided",
          resume_url: candidate.resume_url || "#"
        };
  
        return emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, // Your EmailJS service ID
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Your email template ID
          templateParams,
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-64 bg-blue-200 rounded-lg mb-6"></div>
          <div className="h-64 w-full max-w-3xl bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-8 w-32 bg-blue-200 rounded"></div>
            <div className="h-24 w-full bg-slate-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white border border-red-200 rounded-lg shadow-lg max-w-lg">
          <div className="text-red-500 flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Job Not Found</h2>
          <p className="text-slate-600 mb-6">The job you're looking for does not exist or has been removed.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b p-6">
          <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="h-8 w-8" />
            {job.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 p-6 bg-white">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform">
              <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2 border-b border-blue-100 pb-2">
                <Info size={20} className="text-blue-600" />
                Job Description
              </h3>
              <p className="text-slate-700 leading-relaxed">{job.description}</p>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform">
              <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2 border-b border-blue-100 pb-2">
                <Info size={20} className="text-blue-600" />
                Job Details
              </h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-slate-700">
                  <Building size={18} className="text-blue-500" /> 
                  <span className="font-medium min-w-24">Department:</span>
                  <span className="font-medium bg-blue-50 px-3 py-1 rounded-full">{job.department}</span>
                </p>
                <p className="flex items-center gap-3 text-slate-700">
                  <MapPin size={18} className="text-blue-500" /> 
                  <span className="font-medium min-w-24">Location:</span>
                  <span className="font-medium bg-blue-50 px-3 py-1 rounded-full">{job.location || 'Not Specified'}</span>
                </p>
                <p className="flex items-center gap-3 text-slate-700">
                  <GraduationCap size={18} className="text-blue-500" /> 
                  <span className="font-medium min-w-24">Experience:</span>
                  <span className="font-medium bg-blue-50 px-3 py-1 rounded-full">{job.experience_level}</span>
                </p>
                <div>
                  <p className="flex items-center gap-2 text-slate-700 mb-3">
                    <CircleCheckBig size={18} className="text-blue-500" /> 
                    <span className="font-medium">Required Skills:</span>
                  </p>
                  <div className="flex flex-wrap gap-2 ml-7">
                    {job.required_skills?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-300 px-3 py-1">
                        {skill}
                      </Badge>
                    )) || 'None specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t p-6">
          <div className="w-full">
            <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2">
              <FileUp size={20} className="text-blue-600" />
              Upload Candidate Resumes
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <Input 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:font-medium hover:file:bg-blue-700 transition-all file:cursor-pointer"
              />
              <Button 
                onClick={handleResumeUpload}
                disabled={resumeFiles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center gap-2 shadow-md"
              >
                <FileUp size={18} />
                Upload {resumeFiles.length > 0 ? `${resumeFiles.length} ` : ''}Resumes
              </Button>
            </div>
            {uploadStatus && (
              <div className="mt-3 text-sm bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-200 flex items-center gap-2 animate-pulse">
                <Info size={16} className="text-blue-500" />
                {uploadStatus}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {job.candidates && job.candidates.length > 0 && (
        <Card className="mt-8 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 border-b p-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Award className="h-7 w-7" />
              Top Candidates ({job.candidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-100 to-blue-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCandidates.length === job.candidates.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all candidates"
                        className="rounded border-blue-300"
                      />
                    </TableHead>
                    <TableHead className="w-16 text-center font-bold text-blue-800">Rank</TableHead>
                    <TableHead className="font-bold text-blue-800">Name</TableHead>
                    <TableHead className="font-bold text-blue-800">Job Match</TableHead>
                    <TableHead className="text-right font-bold text-blue-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.candidates.map((candidate, index) => (
                    <TableRow key={candidate._id} className="hover:bg-blue-50 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedCandidates.includes(candidate._id)}
                          onCheckedChange={() => toggleCandidateSelection(candidate._id)}
                          aria-label={`Select ${candidate.name}`}
                          className="rounded border-blue-300"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {index < 3 ? (
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                              ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}
                            `}>
                              {index + 1}
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-slate-100 border-slate-300">
                              {index + 1}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          {index < 3 && <Star size={16} className="text-yellow-500" />}
                          {candidate.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'default' : 
                            parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'secondary' : 
                            'destructive'
                          }
                          className={`
                            px-3 py-1 font-medium
                            ${parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'bg-green-100 text-green-800 border border-green-300' : 
                              parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 
                              'bg-red-100 text-red-800 border border-red-300'}
                          `}
                        >
                          {candidate.match_result?.JD_Match || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <CandidateDetailsDialog candidate={candidate} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 border-t p-6">
            <Button 
              onClick={sendEmailToSelectedCandidates}
              disabled={selectedCandidates.length === 0}
              className={`
                flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                transition-all duration-300 hover:scale-105 py-6 px-6
                text-lg font-medium shadow-md
                ${selectedCandidates.length > 0 ? 'animate-pulse' : ''}
              `}
            >
              <Mail size={20} />
              Send Email to {selectedCandidates.length} Selected Candidate{selectedCandidates.length !== 1 ? 's' : ''}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default JobDetails;