import React, { useEffect, useState } from 'react';
import { GetAllEmployees } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Users, Building, BadgeDollarSign, TrendingUp } from 'lucide-react';

const Statistics = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      const data = await GetAllEmployees();
      setEmployees(data.employees);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Calculate statistics from employees data
  const calculateStats = () => {
    if (!employees.length) return null;

    // Department distribution
    const deptCount = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const departmentData = Object.entries(deptCount).map(([department, count]) => ({
      department,
      count
    }));

    // Salary ranges
    const salaryRanges = [
      { range: '0-30k', min: 0, max: 30000, count: 0 },
      { range: '30k-50k', min: 30000, max: 50000, count: 0 },
      { range: '50k-80k', min: 50000, max: 80000, count: 0 },
      { range: '80k+', min: 80000, max: Infinity, count: 0 }
    ];

    employees.forEach(emp => {
      const salary = Number(emp.salary);
      const range = salaryRanges.find(r => salary >= r.min && salary < r.max);
      if (range) range.count++;
    });

    // Average salary
    const avgSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0) / employees.length;

    return {
      totalEmployees: employees.length,
      departmentData,
      salaryRanges,
      averageSalary: avgSalary,
      departments: Object.keys(deptCount).length
    };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading statistics...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  const stats = calculateStats();
  if (!stats) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Company Statistics</h1>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(stats.averageSalary).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Dept</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalEmployees / stats.departments)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Department Distribution */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentData}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {stats.departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Salary Distribution */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.salaryRanges}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.salaryRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Department</th>
                  <th className="border border-gray-300 px-4 py-2">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                    <td className="border border-gray-300 px-4 py-2">${Number(employee.salary).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;