import PageHead from '@/components/shared/page-head.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs.js';
import StudentAchievments from './components/student-achievements.js';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Student {
  id: number;
  name: string;
  class_section: string;
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [contCompleted, setCountCompleted] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const countStudents = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/student/count',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setTotalStudent(response.data.data);
      } catch (error) {
        console.error('API error:', error);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/student/completed-ojt/list',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCountCompleted(response.data.count);
        setStudents(response.data.data);
      } catch (error) {
        console.error('API error:', error);
      }
    };

    countStudents();
    fetchAchievements();
  }, []);

  return (
    <>
      <PageHead title="Dashboard | App" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudent}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students Completed OJT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contCompleted}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>List of Students Completed OJT</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-black-100">
                      <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Full Name</th>
                        <th className="border px-4 py-2">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-4 text-center">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        students.map((student, index) => (
                          <tr key={student.id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{student.name}</td>
                            <td className="border px-4 py-2">
                              {student.class_section}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentAchievments />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
