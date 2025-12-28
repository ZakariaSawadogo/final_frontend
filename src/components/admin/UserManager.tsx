import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Label,
    TextInput,
    Select,
    Card,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow, TableCell
} from 'flowbite-react';
import { Api } from '../../helper/api';
import type {User} from '../../types/User';
import type {ProfileType} from '../../types/ProfileType';
import type {ClassLevel} from '../../types/ClassLevel';

const UserManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<ProfileType[]>([]);
    const [classes, setClasses] = useState<ClassLevel[]>([]);

    const [formData, setFormData] = useState({
        username: '', password: '', firstName: '', lastName: '',
        profile_type_id: 3,
        class_level_id: '' as string | number
    });

    const loadData = async () => {
        const [uData, rData, cData] = await Promise.all([
            Api.getAllUsers(), Api.getProfileTypes(), Api.getClassLevels()
        ]);
        setUsers(uData);
        setRoles(rData);
        setClasses(cData);
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = { ...formData };
            if (!payload.class_level_id) delete payload.class_level_id;
            else payload.class_level_id = Number(payload.class_level_id);

            await Api.createUser(payload);
            alert('Utilisateur créé !');
            loadData();
            setFormData({ ...formData, username: '', password: '' });
        } catch (err) { alert("Erreur création user"); }
    };

    return (
        <div>
            <Card className="mb-6">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Ajouter un utilisateur
                </h5>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-2 block"><Label value="Nom d'utilisateur" /></div>
                        <TextInput placeholder="username" required value={formData.username}
                                   onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Mot de passe" /></div>
                        <TextInput type="password" placeholder="********" required value={formData.password}
                                   onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Prénom" /></div>
                        <TextInput placeholder="Prénom" required value={formData.firstName}
                                   onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div>
                        <div className="mb-2 block"><Label value="Nom" /></div>
                        <TextInput placeholder="Nom" required value={formData.lastName}
                                   onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>

                    <div>
                        <div className="mb-2 block"><Label value="Rôle" /></div>
                        <Select value={formData.profile_type_id}
                                onChange={e => setFormData({...formData, profile_type_id: Number(e.target.value)})}>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select>
                    </div>

                    {roles.find(r => r.id === formData.profile_type_id)?.name === 'STUDENT' && (
                        <div>
                            <div className="mb-2 block"><Label value="Classe" /></div>
                            <Select required value={formData.class_level_id}
                                    onChange={e => setFormData({...formData, class_level_id: e.target.value})}>
                                <option value="">-- Choisir une Classe --</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2 mt-2">
                        <Button type="submit" gradientDuoTone="purpleToBlue">Créer Utilisateur</Button>
                    </div>
                </form>
            </Card>

            <div className="overflow-x-auto">
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>Nom</TableHeadCell>
                        <TableHeadCell>Username</TableHeadCell>
                        <TableHeadCell>Rôle</TableHeadCell>
                        <TableHeadCell>Classe</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {users.map(u => (
                            <TableRow key={u.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {u.firstName} {u.lastName}
                                </TableCell>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {u.profileType?.name}
                  </span>
                                </TableCell>
                                <TableCell>{u.classLevel ? u.classLevel.name : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserManager;