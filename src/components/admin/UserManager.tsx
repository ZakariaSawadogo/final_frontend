import React, { useEffect, useState } from 'react';
import { Table, Button, Label, TextInput, Select, FileInput, Badge, Modal, Avatar, TableHead, TableHeadCell, TableBody, TableRow, TableCell, ModalBody, ModalHeader } from 'flowbite-react';
import { HiTrash, HiPlus, HiSearch, HiPencil } from 'react-icons/hi';
import { Api } from '../../helper/api';
import type {User} from '../../types/User';
import type {ProfileType} from '../../types/ProfileType';
import type {ClassLevel} from '../../types/ClassLevel';

const UserManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<ProfileType[]>([]);
    const [classes, setClasses] = useState<ClassLevel[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const [editingId, setEditingId] = useState<number | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roleId, setRoleId] = useState(3);
    const [classId, setClassId] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);

    const loadData = async () => {
        const [uData, rData, cData] = await Promise.all([
            Api.getAllUsers(), Api.getProfileTypes(), Api.getClassLevels()
        ]);
        setUsers(uData);
        setRoles(rData);
        setClasses(cData);
    };

    useEffect(() => { loadData(); }, []);

    const handleEdit = (u: User) => {
        setEditingId(u.id);
        setUsername(u.username);
        setPassword('');
        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
        // On garde l'ancien rôle en mémoire mais on ne l'affiche pas
        setRoleId(u.profile_type_id);
        setClassId(u.class_level_id ? u.class_level_id.toString() : '');
        setPhoto(null);
        setOpenModal(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setUsername(''); setPassword(''); setFirstName(''); setLastName('');
        setRoleId(3); setClassId(''); setPhoto(null);
        setOpenModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            if (password) formData.append('password', password);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);

            // LOGIQUE MODIFIÉE : On n'envoie le rôle et la classe QUE si c'est une création
            if (!editingId) {
                formData.append('profile_type_id', roleId.toString());
                if (roles.find(r => r.id === roleId)?.name === 'STUDENT' && classId) {
                    formData.append('class_level_id', classId);
                }
            }

            if (photo) formData.append('photo', photo);

            if (editingId) {
                await Api.updateUser(editingId, formData);
                alert('User succesfully modified !');
            } else {
                if (!password) { alert('Password required for creation.'); return; }
                await Api.createUser(formData);
                alert('User succesfully created !');
            }

            setOpenModal(false);
            await loadData();
        } catch (err) { alert(err.response?.data?.message || "Error while saving."); }
    };

    const handleDelete = async (id: number) => {
        if(!window.confirm("Delete this user ?")) return;
        try { await Api.deleteUser(id);
            await loadData();
        }
        catch (e: any) {
            const message = e.response?.data?.message || "Impossible : User linked to data.";
            alert(message);
        }
    };

    const processedUsers = users
        .filter(u =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') return (a.lastName || '').localeCompare(b.lastName || '');
            if (sortBy === 'role') return (a.profileType?.name || '').localeCompare(b.profileType?.name || '');
            if (sortBy === 'class') return (a.classLevel?.name || 'Z').localeCompare(b.classLevel?.name || 'Z');
            return 0;
        });

    return (
        <div className="text-gray-900"> {/* Force texte noir globalement ici */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <TextInput className="bg-white rounded-full" icon={HiSearch} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <Select className="bg-white rounded-full" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="name">Sort by name</option>
                        <option value="role">Sort by role</option>
                        <option value="class">Sort by class</option>
                    </Select>
                </div>
                <Button color="green" outline onClick={handleCreate}>
                    <HiPlus className="mr-2 h-5 w-5" /> New User
                </Button>
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
                <Table hoverable>
                    <TableHead className="bg-gray-100 text-gray-700">
                        <TableHeadCell>Avatar</TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Username</TableHeadCell>
                        <TableHeadCell>Role</TableHeadCell>
                        <TableHeadCell>Class</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y text-gray-900">
                        {processedUsers.map(u => (
                            <TableRow key={u.id} className="bg-white hover:bg-gray-50 border-gray-200">
                                <TableCell><Avatar img={u.photo || undefined} rounded size="xs" placeholderInitials={u.username.substring(0,2).toUpperCase()} /></TableCell>
                                <TableCell className="font-bold">{u.firstName} {u.lastName}</TableCell>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>
                                    <Badge color={u.profileType?.name === 'ADMIN' ? 'purple' : u.profileType?.name === 'PROF' ? 'yellow' : 'green'}>
                                        {u.profileType?.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>{u.classLevel?.name || '-'}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="xs" color="light" onClick={() => handleEdit(u)} className="border-gray-300">
                                            <HiPencil className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button size="xs" color="red" onClick={() => handleDelete(u.id)}>
                                            <HiTrash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* MODAL BLANCHE ET LISIBLE */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg" className="bg-gray-900/50">
                <ModalHeader className="bg-gray border-b border-gray-200 text-gray-900">
                    {editingId ? "Modify user" : "Add new user"}
                </ModalHeader>
                <ModalBody className="bg-gray text-black-900">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><div className="mb-2 block"><Label aria-label="Username" className="text-gray-900" /></div><TextInput className="bg-white" placeholder="mustafa25" required value={username} onChange={e => setUsername(e.target.value)} /></div>
                            <div>
                                <div className="mb-2 block"><Label aria-label={editingId ? "Password (leave empty if unchanged)" : "Password"} className="text-gray-900" /></div>
                                <TextInput className="bg-white" type="password" placeholder="•••••••" required={!editingId} value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div><div className="mb-2 block"><Label aria-label="Surname" className="text-gray-900" /></div><TextInput className="bg-white" placeholder="mustafa" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                            <div><div className="mb-2 block"><Label aria-label="Name" className="text-gray-900" /></div><TextInput className="bg-white" placeholder="tosun" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                        </div>

                        {/* SECTION RÔLE : SEULEMENT EN CRÉATION */}
                        {!editingId && (
                            <>
                                <div>
                                    <div className="mb-2 block"><Label aria-label="Role" className="text-gray-900" /></div>
                                    <Select className="bg-white" value={roleId} onChange={e => setRoleId(Number(e.target.value))}>
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </Select>
                                </div>

                                {roles.find(r => r.id === roleId)?.name === 'STUDENT' && (
                                    <div>
                                        <div className="mb-2 block"><Label aria-label="Class" className="text-gray-900" /></div>
                                        <Select className="bg-white" required value={classId} onChange={e => setClassId(e.target.value)}>
                                            <option value="">-- Choisir --</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}

                        <div><div className="mb-2 block"><Label aria-label="Photo" className="text-gray-900" /></div><FileInput className="bg-white" onChange={e => setPhoto(e.target.files ? e.target.files[0] : null)} /></div>

                        <Button type="submit" color="purple" className="w-full mt-4">
                            {editingId ? "Save modifications" : "Create"}
                        </Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};
export default UserManager;