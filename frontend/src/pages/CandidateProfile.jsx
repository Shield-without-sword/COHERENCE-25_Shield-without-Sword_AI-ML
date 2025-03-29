import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download, 
  Eye, 
  Info, 
  Briefcase, 
  Building, 
  GraduationCap, 
  BarChart, 
  CircleCheckBig, 
  UserCheck,
  Mail,
  Phone,
  Code
} from 'lucide-react';

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/candidates/${candidateId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidate details');
        }

        const data = await response.json();
        setCandidate(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching candidate details:', error);
        setIsLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId]);

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

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white border border-red-200 rounded-lg shadow-lg max-w-lg">
          <div className="text-red-500 flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Candidate Not Found</h2>
          <p className="text-slate-600 mb-6">The candidate you're looking for does not exist or has been removed.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Extract first name
  const firstName = candidate.name.split(' ')[0];
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <Link to={`/jobs/${candidate.job_id}`}>
        <Button 
          variant="outline" 
          className="mb-4 bg-white hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Job
        </Button>
      </Link>
      
      <Card className="shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b p-6">
          <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
            <UserCheck className="h-8 w-8" />
            {firstName}'s Candidate Profile
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-8 p-6 bg-white">


          <div className="grid md:grid-cols-2 gap-8">
            {/* Job Match Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform">
              <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2 border-b border-blue-100 pb-2">
                <BarChart size={20} className="text-blue-600" />
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
                          text-sm px-3 py-1 ${
                            parseFloat(candidate.match_result?.JD_Match) >= 80 ? 'bg-green-100 text-green-800 border-green-300' : 
                            parseFloat(candidate.match_result?.JD_Match) >= 60 ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                            'bg-red-100 text-red-800 border-red-300'
                          }
                        `}
                      >
                        {candidate.match_result?.JD_Match || `${candidate.match_percentage}%` || 'N/A'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Application Date</TableCell>
                    <TableCell>{formatDate(candidate.uploaded_at?.$date)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Missing Keywords Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform">
              <h3 className="font-bold text-xl mb-4 text-amber-700 flex items-center gap-2 border-b border-blue-100 pb-2">
                <Info size={20} className="text-amber-500" />
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
          <div className="mt-8">
            <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2 border-b border-green-100 pb-2">
              <Info size={20} className="text-green-500" />
              Profile Summary
            </h3>
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-slate-700 leading-relaxed">
                {candidate.match_result?.Profile_Summary || 'No profile summary available'}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h3 className="font-bold text-xl mb-4 text-purple-700 flex items-center gap-2 border-b border-purple-100 pb-2">
              <Code size={20} className="text-purple-500" />
              Key Skills
            </h3>
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((skill, index) => (
                  <Badge key={index} className="bg-purple-100 hover:bg-purple-200 transition-colors duration-200 text-purple-800 border-purple-200 px-3 py-1">
                    {skill}
                  </Badge>
                ))}
                {(!candidate.skills || candidate.skills.length === 0) && (
                  <p className="text-slate-500 italic">No skills listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform">
              <h3 className="font-bold text-xl mb-4 text-indigo-700 flex items-center gap-2 border-b border-blue-100 pb-2">
                <Briefcase size={20} className="text-indigo-500" />
                Professional Details
              </h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-slate-700">
                  <Building size={18} className="text-blue-500" />
                  <span className="font-medium min-w-24">Current Role:</span>
                  <span className="font-medium bg-blue-50 px-3 py-1 rounded-full">
                    {candidate.current_job_title || "Not specified"}
                  </span>
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-slate-700">
                    <GraduationCap size={18} className="text-blue-500" />
                    <span className="font-medium">Education:</span>
                  </div>
                  <div className="pl-8 space-y-2">
                    {candidate.education && Array.isArray(candidate.education) ? (
                      candidate.education.map((edu, index) => (
                        <div key={index} className="bg-blue-50 px-3 py-2 rounded-lg font-medium text-slate-700">
                          {edu}
                        </div>
                      ))
                    ) : (
                      <div className="bg-blue-50 px-3 py-2 rounded-lg font-medium text-slate-700">
                        {typeof candidate.education === 'string' ? candidate.education : "No education details provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-1 transform flex flex-col justify-center items-center">
              <h3 className="font-bold text-xl mb-6 text-blue-700 flex items-center gap-2 w-full border-b border-blue-100 pb-2">
                <Download size={20} className="text-blue-500" />
                Resume Download
              </h3>
              <Button 
                onClick={() => window.open(candidate.resume_url || "#", '_blank')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 py-6 px-6 text-lg font-medium shadow-md w-full md:w-2/3"
                disabled={!candidate.resume_url}
              >
                <Download size={20} />
                Download Resume
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                {candidate.resume_url ? "Click to view or download the original resume" : "No resume available"}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-t border-blue-100">
          <div className="w-full flex justify-between items-center">
            <p className="text-slate-500 text-sm">
              Candidate ID: {candidateId || candidate._id?.$oid}
            </p>
            <Button
              variant="outline"
              className="hover:bg-blue-100 hover:border-blue-300 transition-all"
            >
              <Eye size={16} className="mr-2" />
              View Full Resume
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Missing import definition
const Calendar = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default CandidateProfile;