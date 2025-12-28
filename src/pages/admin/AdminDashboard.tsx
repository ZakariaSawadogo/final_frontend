import React from 'react';
import {Tabs, Card, TabItem} from 'flowbite-react';
import { HiUserGroup, HiAcademicCap, HiBookOpen } from 'react-icons/hi'; // Icons optionnels
import ClassManager from '../../components/admin/ClassManager';
import UserManager from '../../components/admin/UserManager';
import CourseManager from '../../components/admin/CourseManager';

const AdminDashboard = () => {
    return (
        <div className="mt-4">
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Tableau de Bord Directeur
                </h2>
                <Tabs aria-label="Tabs with icons" variant="underline">
                    <TabItem active title="Utilisateurs" icon={HiUserGroup}>
                        <UserManager />
                    </TabItem>
                    <TabItem title="Classes" icon={HiAcademicCap}>
                        <ClassManager />
                    </TabItem>
                    <TabItem title="Cours" icon={HiBookOpen}>
                        <CourseManager />
                    </TabItem>
                </Tabs>
            </Card>
        </div>
    );
};

export default AdminDashboard;