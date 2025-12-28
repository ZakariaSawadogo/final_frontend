import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from "./teacher/TeacherDashboard.tsx";

// Importe ici tes futurs composants (AdminUsers, TeacherGrades, etc.)
// import AdminDashboard from './admin/AdminDashboard';
// import TeacherDashboard from './teacher/TeacherDashboard';
// import StudentDashboard from './student/StudentDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return <p>Chargement...</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar simplifiée */}
            <nav className="bg-white shadow p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold text-gray-800">
        Bienvenue, {user.firstName} {user.lastName} ({user.profileType?.name})
    </h1>
    <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
        Déconnexion
        </button>
        </nav>

        <main className="p-8">
        {/* Affichage conditionnel selon le rôle */}

            {user.profileType?.name === 'ADMIN' && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">Espace Directeur</h2>
                    <AdminDashboard /> {/* <--- Affiche le composant ici */}
                </div>
            )}

            {user.profileType?.name === 'PROF' && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Espace Professeur</h2>
                    </div>
                    <p className="mb-6 text-gray-600">Sélectionnez un cours pour saisir les notes.</p>

                    <TeacherDashboard /> {/* <--- Affiche le composant ici */}
                </div>
            )}

    {user.profileType?.name === 'STUDENT' && (
        <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Espace Élève ({user.classLevel?.name})</h2>
    <p>Ici, tu verras ton bulletin et tes moyennes.</p>
        {/* <StudentDashboard /> */}
        </div>
    )}
    </main>
    </div>
);
};

export default Dashboard;