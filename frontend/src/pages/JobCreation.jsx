import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const JobCreationForm = () => {
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    requiredSkills: [],
    experienceLevel: '',
    minExperience: 0,
    maxExperience: 0
  });

  const [skill, setSkill] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skill && !jobData.requiredSkills.includes(skill)) {
      setJobData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Job created successfully!');
        // Reset form or navigate to job listings
      } else {
        alert('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An error occurred while creating the job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input 
                name="title"
                value={jobData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div>
              <Label>Department</Label>
              <Select 
                name="department"
                onValueChange={(value) => handleInputChange({ 
                  target: { name: 'department', value } 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Job Location</Label>
              <Input 
                name="location"
                value={jobData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA (Remote)"
              />
            </div>

            <div>
              <Label>Job Description</Label>
              <Textarea 
                name="description"
                value={jobData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed job description..."
                rows={5}
                required
              />
            </div>

            <div>
              <Label>Required Skills</Label>
              <div className="flex space-x-2 mb-2">
                <Input 
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobData.requiredSkills.map((s) => (
                  <div 
                    key={s} 
                    className="bg-gray-200 px-2 py-1 rounded-full flex items-center"
                  >
                    {s}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Experience Level</Label>
                <Select 
                  name="experienceLevel"
                  onValueChange={(value) => handleInputChange({ 
                    target: { name: 'experienceLevel', value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Experience Range (Years)</Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number"
                    name="minExperience"
                    value={jobData.minExperience}
                    onChange={handleInputChange}
                    placeholder="Min"
                    min="0"
                    max="30"
                  />
                  <Input 
                    type="number"
                    name="maxExperience"
                    value={jobData.maxExperience}
                    onChange={handleInputChange}
                    placeholder="Max"
                    min="0"
                    max="30"
                  />
                </div>
              </div>
            </div>

            <CardFooter className="justify-end">
              <Button type="submit">Create Job Listing</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreationForm;