import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useNavigate } from 'react-router-dom';

function Feature() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
const navigate = useNavigate();
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/candidates')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
        setError(`Failed to fetch candidates: ${error.message}`);
        setLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.current_job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills?.some(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return "No skills listed";

    return (
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 5).map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
        ))}
        {skills.length > 5 && <Badge variant="outline" className="text-xs">+{skills.length - 5} more</Badge>}
      </div>
    );
  };

const formatEducation = (education) => {
  if (!education) return "Not specified";

  // If education is a string, return it directly
  if (typeof education === 'string') return education;

  // If education is an array, format the first entry
  if (Array.isArray(education) && education.length > 0) {
    const edu = education[0]; // Take the first education entry
    return `${edu.degree || "Degree"} in ${edu.major || "N/A"} from ${edu.university || "Unknown University"}`;
  }

  // If education is an object, format it
  if (typeof education === 'object') {
    return `${education.degree || "Degree"} in ${education.major || "N/A"} from ${education.university || "Unknown University"}`;
  }

  return "Not specified";
};

  const getMatchBadgeVariant = (percentage) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "info";
    if (percentage >= 40) return "warning";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Directory</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="grid" onValueChange={setViewMode} value={viewMode} className="w-full">
        <TabsList className="grid w-52 grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {filteredCandidates.length > 0 ? (
          <>
            <TabsContent value="grid" className={viewMode === "grid" ? "block" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                  <Card key={candidate._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                          {candidate.name ? candidate.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{candidate.name || "Unnamed Candidate"}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.current_job_title || "Position not specified"}</p>
                          <p className="text-sm text-blue-500">{candidate.email}</p>
                          <p className="text-sm text-muted-foreground mt-2">{formatEducation(candidate.education)}</p>

                          <Badge
                            variant={getMatchBadgeVariant(candidate.match_percentage)}
                            className="mt-2"
                          >
                            {candidate.match_percentage || 0}% Match
                          </Badge>

                          <h4 className="text-sm font-medium mt-4 mb-2">Key Skills</h4>
                          {renderSkills(candidate.skills)}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.location.href = `/candidates/${candidate._id}`}
                          >
                            View Profile
                          </Button>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table" className={viewMode === "table" ? "block" : "hidden"}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Title</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Match %</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate._id}>
                        <TableCell className="font-medium">{candidate.name || "Unnamed Candidate"}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>{candidate.current_job_title || "Position not specified"}</TableCell>
                        <TableCell>{formatEducation(candidate.education)}</TableCell>
                        <TableCell>
                          <Badge variant={getMatchBadgeVariant(candidate.match_percentage)}>
                            {candidate.match_percentage || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>{renderSkills(candidate.skills)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.location.href = `/candidates/${candidate._id}`}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        ) : (
          <Card className="text-center p-8">
            <div className="text-3xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No candidates found</h2>
            <p className="text-muted-foreground">Try adjusting your search or check back later for new candidates.</p>
          </Card>
        )}
      </Tabs>
    </div>
  );
}

export default Feature;
