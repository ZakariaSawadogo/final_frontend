import React, { useEffect, useState } from 'react';
import {
    Button, Label, TextInput, Select, Table, Modal, TableHead, TableHeadCell, TableBody, TableRow, TableCell, ModalBody,
    ModalHeader
} from 'flowbite-react';
import { HiTrash, HiPlus, HiPencil } from 'react-icons/hi';
import { Api } from '../../helper/api';
import type {Course} from '../../types/Course';
import type {ClassLevel} from '../../types/ClassLevel';
import type {User} from '../../types/User';

const CourseManager = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [profs, setProfs] = useState<User[]>([]);
    const [classes, setClasses] = useState<ClassLevel[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [sortBy, setSortBy] = useState('class');

    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', coefficient: 1, classLevelId: '', teacherId: '' });

    const loadData = async () => {
        const [cData, uData, clData] = await Promise.all([Api.getAllCourses(), Api.getAllUsers(), Api.getClassLevels()]);
        setCourses(cData);
        setClasses(clData);
        setProfs(uData.filter(u => u.profileType?.name === 'PROF'));
    };
    useEffect(() => { loadData(); }, []);

    const handleCreate = () => {
        setEditingId(null);
        setForm({ name: '', coefficient: 1, classLevelId: '', teacherId: '' });
        setOpenModal(true);
    };

    const handleEdit = (c: Course) => {
        setEditingId(c.id);
        setForm({
            name: c.name,
            coefficient: c.coefficient,
            classLevelId: c.class_level_id.toString(),
            teacherId: c.teacher_id ? c.teacher_id.toString() : ''
        });
        setOpenModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = {
            name: form.name,
            coefficient: Number(form.coefficient),
            teacher_id: Number(form.teacherId)
        };
        // On n'ajoute la classe QUE si c'est une création
        if (!editingId) {
            payload.class_level_id = Number(form.classLevelId);
        }

        if (editingId) await Api.updateCourse(editingId, payload);
        else await Api.createCourse(payload);

        setOpenModal(false);
        loadData();
    };

    const handleDelete = async (id: number) => {
        if(!window.confirm("Delete this course ?")) return;
        try { await Api.deleteCourse(id); loadData(); } catch (e) { alert("Impossible."); }
    };

    const sortedCourses = [...courses].sort((a, b) => {
        if (sortBy === 'class') return (a.classLevel?.name || '').localeCompare(b.classLevel?.name || '');
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <div>
            <div className="flex justify-between mb-4 text-gray-900">
                <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="class">Sort by class</option>
                    <option value="name">Sort by course</option>
                </Select>
                <Button color="blue" onClick={handleCreate}>
                    <HiPlus className="mr-2 h-5 w-5" /> New course
                </Button>
            </div>

            <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
                <Table hoverable>
                    <TableHead className="bg-gray-50 text-gray-900">
                        <TableHeadCell>Course</TableHeadCell>
                        <TableHeadCell>Coef.</TableHeadCell>
                        <TableHeadCell>Class</TableHeadCell>
                        <TableHeadCell>Teacher</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {sortedCourses.map(c => (
                            <TableRow key={c.id} className="bg-white text-gray-900">
                                <TableCell className="font-bold">{c.name}</TableCell>
                                <TableCell>{c.coefficient}</TableCell>
                                <TableCell>{c.classLevel?.name}</TableCell>
                                <TableCell>{c.teacher?.lastName} {c.teacher?.firstName}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="xs" color="light" onClick={() => handleEdit(c)}><HiPencil className="text-blue-600"/></Button>
                                        <Button size="xs" color="red" onClick={() => handleDelete(c.id)}><HiTrash /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader>{editingId ? 'Modify this course' : 'Add a course'}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><div className="mb-2 block"><Label aria-label="Course"> <option value="">Course name </option></Label></div><TextInput value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                            <div><div className="mb-2 block"><Label aria-label="Coefficient"> <option value="">Coefficient</option></Label></div><TextInput type="number" value={form.coefficient} onChange={e => setForm({...form, coefficient: Number(e.target.value)})} required /></div>
                        </div>
                        <div>
                            <div className="mb-2 block"><Label aria-label="Class" /></div>
                            <Select
                                value={form.classLevelId}
                                onChange={e => setForm({...form, classLevelId: e.target.value})}
                                required
                                disabled={!!editingId} // DÉSACTIVÉ EN ÉDITION !
                                className={editingId ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                <option value="">-- Choose a class --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                            {editingId && <p className="text-xs text-red-500 mt-1">Impossible to modify the class of an existing course.</p>}
                        </div>
                        <div>
                            <div className="mb-2 block"><Label aria-label="Professeur" /></div>
                            <Select value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} required>
                                <option value="">-- Choose a teacher --</option>
                                {profs.map(p => <option key={p.id} value={p.id}>{p.lastName} {p.firstName}</option>)}
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">Save</Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};
export default CourseManager;