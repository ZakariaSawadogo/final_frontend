import {useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
    ToggleSwitch
} from 'flowbite-react';
import {Api} from '../../helper/api';
import type {Course} from '../../types/Course';
import type {User} from '../../types/User';
import type {Grade} from '../../types/Grade';

interface Props { course: Course; }

const GradeManager = ({ course }: Props) => {
    const [students, setStudents] = useState<User[]>([]);
    const [grades, setGrades] = useState<{ [studentId: number]: Grade }>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const allUsers = await Api.getAllUsers();
            const classStudents = allUsers.filter(u => u.profileType?.name === 'STUDENT' && u.class_level_id === course.class_level_id);
            setStudents(classStudents);

            const gradesMap: { [key: number]: Grade } = {};
            // On utilise Promise.all pour charger toutes les notes en parallèle
            await Promise.all(classStudents.map(async (student) => {
                // Initialize garantit qu'on récupère la note UNIQUE de cet élève pour ce cours
                gradesMap[student.id] = await Api.initializeGrade(student.id, course.id);
            }));
            setGrades(gradesMap);
        };
        loadData();
    }, [course]);

    const handleGradeChange = (studentId: number, field: string, value: string) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value === '' ? undefined : Number(value) }
        }));
    };

    const saveGrade = async (studentId: number) => {
        const g = grades[studentId];
        if (!g) return;
        try {
            await Api.updateGrade(g.id, { devoir1: g.devoir1, devoir2: g.devoir2, composition: g.composition });
            alert("Mark saved !");
        } catch(e) { alert("Error saving mark."); }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-400">Class : {course.classLevel?.name}</h3>
                    <p className="text-sm text-gray-400 font-semibold">{course.name}</p>
                </div>

                <div className="flex items-center gap-2 border p-2 rounded-lg bg-gray-50">
                    <span className={`text-sm font-medium ${!isEditing ? 'text-blue-600' : 'text-gray-500'}`}>Read</span>
                    <ToggleSwitch checked={isEditing} onChange={setIsEditing} />
                    <span className={`text-sm font-medium ${isEditing ? 'text-blue-600' : 'text-gray-500'}`}>Write</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>Student</TableHeadCell>
                        <TableHeadCell>Mid-term1</TableHeadCell>
                        <TableHeadCell>Mid-term2</TableHeadCell>
                        <TableHeadCell>Final</TableHeadCell>
                        <TableHeadCell>Average</TableHeadCell>
                        {isEditing && <TableHeadCell>Action</TableHeadCell>}
                    </TableHead>
                    <TableBody className="divide-y">
                        {students.map(s => {
                            const g = grades[s.id] || {};
                            return (
                                <TableRow key={s.id} className="bg-white">
                                    <TableCell className="font-medium text-gray-900">{s.lastName} {s.firstName}</TableCell>
                                    <TableCell>{isEditing ? <TextInput type="number" sizing="sm" value={g.devoir1 ?? ''} onChange={e => handleGradeChange(s.id, 'devoir1', e.target.value)} /> : (g.devoir1 ?? '-')}</TableCell>
                                    <TableCell>{isEditing ? <TextInput type="number" sizing="sm" value={g.devoir2 ?? ''} onChange={e => handleGradeChange(s.id, 'devoir2', e.target.value)} /> : (g.devoir2 ?? '-')}</TableCell>
                                    <TableCell>{isEditing ? <TextInput type="number" sizing="sm" color="info" value={g.composition ?? ''} onChange={e => handleGradeChange(s.id, 'composition', e.target.value)} /> : <span className="font-bold text-blue-700">{g.composition ?? '-'}</span>}</TableCell>
                                    <TableCell>{g.average ? <Badge color={g.average >= 10 ? 'green' : 'red'}>{g.average.toFixed(2)}</Badge> : '-'}</TableCell>
                                    {isEditing && <TableCell><Button size="xs" color="blue" onClick={() => saveGrade(s.id)}>Save</Button></TableCell>}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
export default GradeManager;