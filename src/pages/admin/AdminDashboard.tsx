import { useEffect, useState } from 'react';
import { Tabs, Card, TabItem } from 'flowbite-react';
import { HiUserGroup, HiAcademicCap, HiBookOpen } from 'react-icons/hi';
import ClassManager from '../../components/admin/ClassManager';
import UserManager from '../../components/admin/UserManager';
import CourseManager from '../../components/admin/CourseManager';
import { Api } from '../../helper/api';

const AdminDashboard = () => {
    // Petites stats pour faire joli
    const [stats, setStats] = useState({ users: 0, classes: 0, courses: 0 });

    useEffect(() => {
        const loadStats = async () => {
            const [u, c, co] = await Promise.all([
                Api.getAllUsers(), Api.getClassLevels(), Api.getAllCourses()
            ]);
            setStats({ users: u.length, classes: c.length, courses: co.length });
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* CARTES STATISTIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-blue-500 bg-white hover:bg-blue-500 transition">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><HiUserGroup className="text-2xl"/></div>
                        <div><p className="text-gray-50 text-sm">Users</p><h3 className="text-2xl text-yellow-500 font-bold">{stats.users}</h3></div>
                    </div>
                </Card>
                <Card className="border-l-4 border-green-500 bg-yellow hover:bg-green-500 transition">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><HiAcademicCap className="text-2xl"/></div>
                        <div><p className="text-gray-50 text-sm">Class</p><h3 className="text-2xl text-yellow-500 font-bold">{stats.classes}</h3></div>
                    </div>
                </Card>
                <Card className="border-l-4 border-purple-500 bg-yellow hover:bg-purple-500 transition">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><HiBookOpen className="text-2xl"/></div>
                        <div><p className="text-gray-50 text-sm">Course</p><h3 className="text-2xl text-yellow-500 font-bold">{stats.courses}</h3></div>
                    </div>
                </Card>
            </div>

            {/* ONGLETS DE GESTION */}
            <Card className="shadow-lg border-t-4 border-amber-400">
                <Tabs aria-label="Admin Tabs" variant="underline" >
                    <TabItem active title="Users" icon={HiUserGroup}>
                        <UserManager />
                    </TabItem>
                    <TabItem title="Class" icon={HiAcademicCap}>
                        <ClassManager />
                    </TabItem>
                    <TabItem title="Courses" icon={HiBookOpen}>
                        <CourseManager />
                    </TabItem>
                </Tabs>
            </Card>
        </div>
    );
};
export default AdminDashboard;