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
      <div className="flex justify-center items-center h-screen">
        <p>Loading candidate profile...</p>
      </div>
    );
  }

  if (!candidate) {
    return <div>Candidate not found</div>;
  }

  // Extract first name
  const firstName = candidate.name.split(' ')[0];

  return (
    <div className="container mx-auto p-4">
      <Link to={`/jobs/${candidate.job_id}`}>
        <Button variant="outline" className="mb-4">
          Back to Job
        </Button>
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>{firstName}'s Candidate Profile</CardTitle>
        </CardHeader>
        
        <CardContent>
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
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={() => window.open(candidate.resume_url, '_blank')}
          >
            Download Resume
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CandidateProfile;