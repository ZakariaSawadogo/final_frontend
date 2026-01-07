import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentDashboard from './student/StudentDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return <div className="text-center mt-20">Chargement...</div>;

    let title = "Tableau de Bord";
    if (user.profileType?.name === 'ADMIN') title = "Administration";
    else if (user.profileType?.name === 'PROF') title = "Teacher";
    else if (user.profileType?.name === 'STUDENT') title = `Student (${user.classLevel?.name || 'Class'})`;

    return (
        <SidebarLayout user={user} title={title} onLogout={logout}>
            {user.profileType?.name === 'ADMIN' && <AdminDashboard />}
            {user.profileType?.name === 'PROF' && <TeacherDashboard />}
            {user.profileType?.name === 'STUDENT' && <StudentDashboard />}
        </SidebarLayout>
    );
};
export default Dashboard;