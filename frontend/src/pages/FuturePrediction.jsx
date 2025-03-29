import React, { useState } from 'react';

const FuturePredictor = () => {
  // Static data - would come from a database in a real implementation
  const staticEmployeeData = [
    { id: 1, department: "Engineering", tenure: 4.2, initialRole: "Junior Developer", currentRole: "Senior Developer", learningScore: 85, adaptabilityScore: 78 },
    { id: 2, department: "Engineering", tenure: 5.6, initialRole: "Software Engineer", currentRole: "Tech Lead", learningScore: 90, adaptabilityScore: 82 },
    { id: 3, department: "Marketing", tenure: 3.8, initialRole: "Marketing Associate", currentRole: "Marketing Manager", learningScore: 76, adaptabilityScore: 88 },
    { id: 4, department: "Sales", tenure: 1.2, initialRole: "Sales Representative", currentRole: "Sales Representative", learningScore: 65, adaptabilityScore: 72 },
    { id: 5, department: "HR", tenure: 7.1, initialRole: "HR Coordinator", currentRole: "HR Director", learningScore: 82, adaptabilityScore: 85 },
    { id: 6, department: "Engineering", tenure: 2.4, initialRole: "QA Engineer", currentRole: "QA Lead", learningScore: 75, adaptabilityScore: 70 },
    { id: 7, department: "Marketing", tenure: 1.5, initialRole: "Digital Marketing Specialist", currentRole: "Digital Marketing Specialist", learningScore: 68, adaptabilityScore: 75 },
    { id: 8, department: "Finance", tenure: 6.3, initialRole: "Accountant", currentRole: "Finance Manager", learningScore: 80, adaptabilityScore: 72 },
  ];

  // State for department filter only
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Get unique departments
  const departments = ['All', ...new Set(staticEmployeeData.map(employee => employee.department))];

  // Filter employees based on department selection
  const filteredEmployees = staticEmployeeData.filter(employee => 
    selectedDepartment === 'All' || employee.department === selectedDepartment
  );

  // Categorize employees based on tenure
  const longTermThreshold = 4; // Employees with tenure ≥ 4 years are considered long-term
  const longTermEmployees = filteredEmployees.filter(e => e.tenure >= longTermThreshold);
  const shortTermEmployees = filteredEmployees.filter(e => e.tenure < longTermThreshold);
  
  // Calculate average metrics
  const avgLearningLongTerm = longTermEmployees.length > 0 
    ? Math.round(longTermEmployees.reduce((sum, e) => sum + e.learningScore, 0) / longTermEmployees.length)
    : 0;
  
  const avgAdaptabilityLongTerm = longTermEmployees.length > 0 
    ? Math.round(longTermEmployees.reduce((sum, e) => sum + e.adaptabilityScore, 0) / longTermEmployees.length)
    : 0;
  
  // Calculate promotion rate
  const promotionRate = longTermEmployees.length > 0 
    ? Math.round(longTermEmployees.filter(e => e.initialRole !== e.currentRole).length / longTermEmployees.length * 100)
    : 0;

  // Format retention data for visual clarity
  const retentionPercentage = Math.round((longTermEmployees.length / filteredEmployees.length) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Candidate Potential & Career Growth Predictor</h1>
      <p className="text-gray-600 mb-6">Analyze which employee traits lead to longer tenure and career growth</p>
      
      {/* Simple Department Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <label className="font-medium text-gray-700 mr-3">Department:</label>
          <select 
            className="p-2 border border-gray-300 rounded-md"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Employee Retention</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {retentionPercentage}% stay 4+ years
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${retentionPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Critical Skills for Retention</h2>
          <div className="text-4xl font-bold text-green-600">{avgLearningLongTerm}</div>
          <div className="text-sm text-gray-600">Learning Score</div>
          <div className="text-4xl font-bold text-blue-600 mt-2">{avgAdaptabilityLongTerm}</div>
          <div className="text-sm text-gray-600">Adaptability Score</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Career Advancement</h2>
          <div className="text-5xl font-bold text-purple-600">{promotionRate}%</div>
          <div className="text-sm text-gray-600 mt-2">of long-term employees receive promotions</div>
        </div>
      </div>

      {/* Employee Data Table - Simplified */}
      <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Employee Success Patterns</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenure</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Career Growth</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Success Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => {
              const successScore = Math.round((employee.learningScore * 0.6) + (employee.adaptabilityScore * 0.4));
              let scoreClass = "text-red-600";
              if (successScore >= 80) scoreClass = "text-green-600 font-medium";
              else if (successScore >= 70) scoreClass = "text-yellow-600";
              
              return (
                <tr key={employee.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{employee.department}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {employee.tenure >= longTermThreshold ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        {employee.tenure.toFixed(1)} years
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                        {employee.tenure.toFixed(1)} years
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {employee.initialRole !== employee.currentRole ? (
                      <span className="text-green-600">{employee.initialRole} → {employee.currentRole}</span>
                    ) : (
                      <span className="text-gray-500">No Change</span>
                    )}
                  </td>
                  <td className={`px-4 py-2 text-sm ${scoreClass}`}>
                    {successScore}
                    {successScore >= 80 && " ★"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Simple Explanation */}
      <div className="bg-blue-50 p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">How To Use This Tool</h2>
        <p className="text-sm text-gray-700">
          The Success Score formula (60% Learning + 40% Adaptability) helps predict which candidates will stay longer and grow within the company. 
          Candidates with scores of 80+ have shown the highest retention and promotion rates in our historical data.
        </p>
      </div>
    </div>
  );
};

export default FuturePredictor;
