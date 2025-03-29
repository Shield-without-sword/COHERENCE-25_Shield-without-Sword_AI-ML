import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Briefcase, Mail, GraduationCap, Award, User, Clock, Calendar } from 'lucide-react';
// Import Tabs components if they exist, otherwise comment out or remove this line
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">{skill}</Badge>
        ))}
        {skills.length > 5 && <Badge variant="outline" className="text-xs hover:bg-gray-100 transition-colors">+{skills.length - 5} more</Badge>}
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

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "bg-blue-100 text-blue-700 border-blue-200";
    if (percentage >= 60) return "bg-indigo-100 text-indigo-700 border-indigo-200";
    if (percentage >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getInitialBgColor = (name) => {
    const colors = [
      "bg-blue-600", "bg-indigo-600", "bg-blue-500", 
      "bg-indigo-500", "bg-blue-700", "bg-indigo-700"
    ];
    
    if (!name) return colors[0];
    
    // Use the character code of the first letter to pick a color
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <User className="h-7 w-7 text-blue-600" />
            Candidate Directory
          </h1>
        </div>



        <div className="flex justify-between items-center mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
            <Input
              type="text"
              placeholder="Search by name, email, job title or skills..."
              className="pl-10 border-blue-200 bg-white/80 w-80"
              disabled
            />
          </div>
          
          <div className="grid w-52 grid-cols-2 bg-white p-1 rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-3">
              <Grid className="h-4 w-4" />
              Grid View
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-600 rounded-md py-2 px-3">
              <List className="h-4 w-4" />
              Table View
            </div>
          </div>
        </div>

        <div className="animate-pulse grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={`loading-${i}`} className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-14 w-14 rounded-full bg-blue-200"></div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-36"></div>
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                    <div className="h-4 bg-slate-200 rounded w-40"></div>
                    <div className="h-4 bg-slate-200 rounded w-56"></div>
                    <div className="h-6 bg-blue-100 rounded w-24"></div>
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-blue-100 rounded w-16"></div>
                      <div className="h-6 bg-blue-100 rounded w-20"></div>
                      <div className="h-6 bg-blue-100 rounded w-18"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <User className="h-7 w-7 text-blue-600" />
            Candidate Directory
          </h1>
        </div>
        
        <Card className="max-w-lg mx-auto mt-8 shadow-lg border-0">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
          <User className="h-7 w-7 text-blue-600" />
          Candidate Directory
        </h1>
      </div>

    
   

      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            type="text"
            placeholder="Search by name, email, job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80"
          />
        </div>

        <div className="grid w-52 grid-cols-2 bg-white p-1 rounded-lg shadow-sm">
          <Button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center justify-center gap-2 rounded-md py-2 ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-blue-50'
            }`}
          >
            <Grid className="h-4 w-4" />
            Grid View
          </Button>
          <Button 
            onClick={() => setViewMode('table')}
            className={`flex items-center justify-center gap-2 rounded-md py-2 ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-blue-50'
            }`}
          >
            <List className="h-4 w-4" />
            Table View
          </Button>
        </div>
      </div>

      {filteredCandidates.length > 0 ? (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate._id} className="hover:shadow-xl transition-all duration-500 hover:translate-y-1 transform cursor-pointer border-0 shadow-md overflow-hidden" onClick={() => navigate(`/candidates/${candidate._id}`)}>
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 h-14 w-14 rounded-full ${getInitialBgColor(candidate.name)} text-white flex items-center justify-center text-xl font-semibold shadow-md`}>
                        {candidate.name ? candidate.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">{candidate.name || "Unnamed Candidate"}</h3>
                        <div className="flex items-center text-sm text-slate-700 gap-1 mt-1">
                          <Briefcase className="h-3 w-3 text-blue-500" />
                          <span>{candidate.current_job_title || "Position not specified"}</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600 gap-1 mt-1">
                          <Mail className="h-3 w-3 text-blue-500" />
                          <span>{candidate.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700 gap-1 mt-2">
                          <GraduationCap className="h-3 w-3 text-blue-500" />
                          <span>{formatEducation(candidate.education)}</span>
                        </div>

                        <div className="flex items-center mt-3">
                          <Award className="h-4 w-4 text-blue-500 mr-2" />
                          <Badge
                            className={getMatchColor(candidate.match_percentage)}
                          >
                            {candidate.match_percentage || 0}% Match
                          </Badge>
                        </div>

                        <h4 className="text-sm font-medium mt-4 mb-2 text-blue-800">Key Skills</h4>
                        {renderSkills(candidate.skills)}
                        
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/candidates/${candidate._id}`);
                            }}
                            className="w-full bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="rounded-md border-0 overflow-hidden shadow-md">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <TableRow>
                    <TableHead className="font-semibold text-white">Name</TableHead>
                    <TableHead className="font-semibold text-white">Email</TableHead>
                    <TableHead className="font-semibold text-white">Current Title</TableHead>
                    <TableHead className="font-semibold text-white">Education</TableHead>
                    <TableHead className="font-semibold text-white">Match %</TableHead>
                    <TableHead className="font-semibold text-white">Skills</TableHead>
                    <TableHead className="font-semibold text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate, index) => (
                    <TableRow key={candidate._id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                      <TableCell className="font-medium">{candidate.name || "Unnamed Candidate"}</TableCell>
                      <TableCell className="text-blue-600">{candidate.email}</TableCell>
                      <TableCell>{candidate.current_job_title || "Position not specified"}</TableCell>
                      <TableCell>{formatEducation(candidate.education)}</TableCell>
                      <TableCell>
                        <Badge className={getMatchColor(candidate.match_percentage)}>
                          {candidate.match_percentage || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>{renderSkills(candidate.skills)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/candidates/${candidate._id}`)}
                          className="bg-white hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 text-blue-600 border-blue-200 transition-colors"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center p-8 shadow-md border-0">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2 text-blue-800">No candidates found</h2>
          <p className="text-slate-600">Try adjusting your search or check back later for new candidates.</p>
        </Card>
      )}
    </div>
  );
}

export default Feature;