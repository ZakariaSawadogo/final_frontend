import React, { useEffect, useState, useContext } from 'react';
import { Card, Button } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';
import { Api } from '../../helper/api';
import type {Course} from '../../types/Course';
import GradeManager from '../../components/teacher/GradeManager';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            if (user) {
                try {
                    const data = await Api.getCoursesByTeacher(user.id);
                    setCourses(data);
                } catch (error) { alert("Impossible de charger les cours"); }
            }
        };
        fetchCourses();
    }, [user]);

    if (selectedCourse) {
        return (
            <div>
                <Button color="light" className="mb-4" onClick={() => setSelectedCourse(null)}>
                    ← Retour à mes cours
                </Button>
                <GradeManager course={selectedCourse} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {courses.map((course) => (
                <Card key={course.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedCourse(course)}>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {course.name}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Classe : {course.classLevel?.name} <br/>
                        Coefficient : {course.coefficient}
                    </p>
                    <Button gradientDuoTone="cyanToBlue">
                        Gérer les notes
                    </Button>
                </Card>
            ))}
        </div>
    );
};

export default TeacherDashboard;