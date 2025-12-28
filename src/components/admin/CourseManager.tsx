import React, { useEffect, useState } from 'react';
import {
    Card,
    Button,
    Label,
    TextInput,
    Select,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow, TableCell
} from 'flowbite-react';
import { Api } from '../../helper/api';
import { Course } from '../../types/Course';
import { ClassLevel } from '../../types/ClassLevel';
import { User } from '../../types/User';

const CourseManager = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [profs, setProfs] = useState<User[]>([]);
    const [classes, setClasses] = useState<ClassLevel[]>([]);

    const [form, setForm] = useState({ name: '', coefficient: 1, classLevelId: '', teacherId: '' });

    const loadData = async () => {
        const [cData, uData, clData] = await Promise.all([
            Api.getAllCourses(), Api.getAllUsers(), Api.getClassLevels()
        ]);
        setCourses(cData);
        setClasses(clData);
        setProfs(uData.filter(u => u.profileType?.name === 'PROF'));
    };

    useEffect(() => { loadData(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await Api.createCourse({
                name: form.name,
                coefficient: Number(form.coefficient),
                class_level_id: Number(form.classLevelId),
                teacher_id: Number(form.teacherId)
            });
            alert('Cours créé !');
            loadData();
        } catch (err) { alert('Erreur création cours'); }
    };

    return (
        <div>
            <Card className="mb-6">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Attribuer un cours
                </h5>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-2 block"><Label value="Nom de la matière" /></div>
                        <TextInput placeholder="ex: Mathématiques" required
                                   value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Coefficient" /></div>
                        <TextInput type="number" min="1" required
                                   value={form.coefficient} onChange={e => setForm({...form, coefficient: Number(e.target.value)})} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Classe" /></div>
                        <Select required value={form.classLevelId} onChange={e => setForm({...form, classLevelId: e.target.value})}>
                            <option value="">-- Choisir Classe --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Professeur" /></div>
                        <Select required value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})}>
                            <option value="">-- Choisir Professeur --</option>
                            {profs.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                        </Select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">Créer le Cours</Button>
                    </div>
                </form>
            </Card>

            <Table hoverable>
                <TableHead>
                    <TableHeadCell>Matière</TableHeadCell>
                    <TableHeadCell>Coefficient</TableHeadCell>
                    <TableHeadCell>Classe</TableHeadCell>
                    <TableHeadCell>Professeur</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {courses.map(c => (
                        <TableRow key={c.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className="font-medium text-gray-900 dark:text-white">{c.name}</TableCell>
                            <TableCell>{c.coefficient}</TableCell>
                            <TableCell>{c.classLevel?.name}</TableCell>
                            <TableCell>{c.teacher?.lastName} {c.teacher?.firstName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CourseManager;