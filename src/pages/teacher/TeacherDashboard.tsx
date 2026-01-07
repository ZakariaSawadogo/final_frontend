// import React, { useEffect, useState, useContext } from 'react';
// import { Card, Button } from 'flowbite-react';
// import { AuthContext } from '../../context/AuthContext';
// import { Api } from '../../helper/api';
// import type {Course} from '../../types/Course';
// import GradeManager from '../../components/teacher/GradeManager';
//
// const TeacherDashboard = () => {
//     const { user } = useContext(AuthContext);
//     const [courses, setCourses] = useState<Course[]>([]);
//     const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//
//     useEffect(() => {
//         if (user) Api.getCoursesByTeacher(user.id).then(setCourses);
//     }, [user]);
//
//     if (selectedCourse) {
//         return <div><Button color="light" className="mb-4" onClick={() => setSelectedCourse(null)}>← Retour</Button><GradeManager course={selectedCourse} /></div>;
//     }
//
//     return (
//         <div className="grid grid-cols-3 gap-6">
//             {courses.map((c) => (
//                 <Card key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedCourse(c)}>
//                     <h5 className="text-xl font-bold">{c.name}</h5>
//                     <p>{c.classLevel?.name} (Coef {c.coefficient})</p>
//                 </Card>
//             ))}
//         </div>
//     );
// };
// export default TeacherDashboard;

import { useEffect, useState, useContext } from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { HiBookOpen, HiArrowLeft } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { Api } from '../../helper/api';
import type {Course} from '../../types/Course';
import GradeManager from '../../components/teacher/GradeManager';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (user) Api.getCoursesByTeacher(user.id).then(setCourses);
    }, [user]);

    if (selectedCourse) {
        return (
            <div className="animate-fade-in">
                <Button color="light" className="mb-4" onClick={() => setSelectedCourse(null)}>
                    <HiArrowLeft className="mr-2 h-5 w-5"/> Back to courses
                </Button>
                <GradeManager course={selectedCourse} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Managed courses</h2>

            {courses.length === 0 ? (
                <div className="text-center p-10 bg-gray-100 rounded-lg text-gray-500">No course found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        <Card
                            key={c.id}
                            className=" border-l-4 border-blue-500 bg-white hover:bg-indigo-500
                            cursor-pointer hover:-translate-y-1 hover:shadow-xl transition duration-300 border-l-4 border-blue-500"
                            onClick={() => setSelectedCourse(c)}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h5 className="text-xl font-bold tracking-tight text-gray-200 ">{c.name}</h5>
                                    <p className="font-normal text-gray-400 mt-1">
                                        Class : <span className="font-semibold text-blue-600">{c.classLevel?.name}</span>
                                    </p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <HiBookOpen className="h-6 w-6"/>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <Badge color="green">Coef: {c.coefficient}</Badge>
                                <span className="text-xs text-gray-400">Clic to manage</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
export default TeacherDashboard;