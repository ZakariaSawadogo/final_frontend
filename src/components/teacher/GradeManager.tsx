import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Select,
    TextInput,
    Card,
    Badge,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow, TableCell
} from 'flowbite-react';
import { Api } from '../../helper/api';
import type {Course} from '../../types/Course';
import type {User} from '../../types/User';
import type {Grade} from '../../types/Grade';

interface Props { course: Course; }

const GradeManager = ({ course }: Props) => {
    const [students, setStudents] = useState<User[]>([]);
    const [grades, setGrades] = useState<{ [studentId: number]: Grade }>({});
    const [term, setTerm] = useState('T1');

    useEffect(() => {
        const loadClassroomData = async () => {
            try {
                const allUsers = await Api.getAllUsers();
                const classStudents = allUsers.filter(u => u.profileType?.name === 'STUDENT' && u.class_level_id === course.class_level_id);
                setStudents(classStudents);

                const gradesMap: { [key: number]: Grade } = {};
                await Promise.all(classStudents.map(async (student) => {
                    const grade = await Api.initializeGrade(student.id, course.id, term);
                    gradesMap[student.id] = grade;
                }));
                setGrades(gradesMap);
            } catch (err) { alert("Erreur chargement"); }
        };
        loadClassroomData();
    }, [course, term]);

    const handleGradeChange = (studentId: number, field: string, value: string) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value === '' ? undefined : Number(value) }
        }));
    };

    const saveGrade = async (studentId: number) => {
        try {
            const g = grades[studentId];
            if (!g) return;
            const updated = await Api.updateGrade(g.id, { devoir1: g.devoir1, devoir2: g.devoir2, composition: g.composition });
            setGrades(prev => ({ ...prev, [studentId]: updated }));
            alert("Note sauvegardée !");
        } catch (e) { alert("Erreur"); }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Notes : {course.name} ({course.classLevel?.name})</h3>
                <Select value={term} onChange={(e) => setTerm(e.target.value)} className="w-40">
                    <option value="T1">Trimestre 1</option>
                    <option value="T2">Trimestre 2</option>
                    <option value="T3">Trimestre 3</option>
                </Select>
            </div>

            <Table hoverable>
                <TableHead>
                    <TableHeadCell>Élève</TableHeadCell>
                    <TableHeadCell>Devoir 1</TableHeadCell>
                    <TableHeadCell>Devoir 2</TableHeadCell>
                    <TableHeadCell>Compo</TableHeadCell>
                    <TableHeadCell>Moyenne</TableHeadCell>
                    <TableHeadCell>Action</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {students.map(s => {
                        const g = grades[s.id] || {};
                        return (
                            <TableRow key={s.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="font-medium text-gray-900">{s.lastName} {s.firstName}</TableCell>
                                <TableCell><TextInput type="number" sizing="sm" value={g.devoir1 ?? ''} onChange={e => handleGradeChange(s.id, 'devoir1', e.target.value)} /></TableCell>
                                <TableCell><TextInput type="number" sizing="sm" value={g.devoir2 ?? ''} onChange={e => handleGradeChange(s.id, 'devoir2', e.target.value)} /></TableCell>
                                <TableCell><TextInput type="number" sizing="sm" color="info" value={g.composition ?? ''} onChange={e => handleGradeChange(s.id, 'composition', e.target.value)} /></TableCell>
                                <TableCell>
                                    {g.average !== undefined ? (
                                        <Badge color={g.average >= 10 ? 'success' : 'failure'} size="sm">{g.average.toFixed(2)}</Badge>
                                    ) : '-'}
                                </TableCell>
                                <TableCell><Button size="xs" color="success" onClick={() => saveGrade(s.id)}>Sauver</Button></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
};

export default GradeManager;