import React, { useEffect, useState } from 'react';
import {Card, Button, Label, TextInput, Modal, ModalHeader, ModalBody} from 'flowbite-react';
import { HiTrash, HiPlus, HiPencil } from 'react-icons/hi';
import { Api } from '../../helper/api';
import type { ClassLevel } from '../../types/ClassLevel';

const ClassManager = () => {
    const [classes, setClasses] = useState<ClassLevel[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    // Nouveaux états pour la logique de génération
    const [suffix, setSuffix] = useState(''); // ex: 'A', 'C', 'D'
    const [level, setLevel] = useState(6);    // 0 à 6

    // Mapping des niveaux
    const getLevelPrefix = (lvl: number) => {
        switch(lvl) {
            case 0: return "Terminale";
            case 1: return "1ère";
            case 2: return "2nde";
            default: return `${lvl}ème`; // 3ème, 4ème...
        }
    };

    const fetchClasses = async () => {
        const data = await Api.getClassLevels();
        // Tri intelligent (Du plus petit niveau au plus grand, ou l'inverse)
        setClasses(data.sort((a, b) => (b.level || 0) - (a.level || 0)));
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleEdit = (c: ClassLevel) => {
        setEditingId(c.id);
        setLevel(c.level || 6);
        // On essaie d'extraire le suffixe du nom complet (ex: "6ème A" -> "A")
        const prefix = getLevelPrefix(c.level || 6);
        setSuffix(c.name.replace(prefix, '').trim());
        setOpenModal(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setSuffix('');
        setLevel(6);
        setOpenModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // GÉNÉRATION AUTOMATIQUE DU NOM
        const fullName = `${getLevelPrefix(level)} ${suffix}`.trim();

        try {
            if (editingId) {
                await Api.updateClassLevel(editingId, fullName, level);
            } else {
                await Api.createClassLevel(fullName, level);
            }
            setOpenModal(false);
            await fetchClasses();
        } catch (error: any) {
            // Gestion de l'erreur d'unicité (backend renvoie souvent 409 ou 500)
            alert(error.response?.data?.message || "Error : This class already exist or an error occured.");
        }
    };

    const handleDelete = async (id: number) => {
        if(!window.confirm("Delete this class ?")) return;
        try { await Api.deleteClassLevel(id); await fetchClasses(); }
        catch (e:any) { alert(e.response?.data?.message || "Impossible : Class being used."); }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button color="green" onClick={handleCreate}>
                    <HiPlus className="mr-2 h-5 w-5" /> New class
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {classes.map(c => (
                    <Card key={c.id} className="relative border-l-4 border-green-500 hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h5 className="font-bold text-xl text-yellow-800">{c.name}</h5>
                                <p className="text-sm text-gray-500">Niveau : {c.level} ({getLevelPrefix(c.level || 0)})</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button size="xs" color="light" pill onClick={() => handleEdit(c)}>
                                    <HiPencil className="text-blue-600"/>
                                </Button>
                                <Button size="xs" color="red" pill onClick={() => handleDelete(c.id)}>
                                    <HiTrash />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
                <ModalHeader>{editingId ? 'Modify class' : 'Create new class'}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <div className="mb-2 block"><Label aria-label="Class level" /></div>
                            <TextInput
                                type="number"
                                min="0"
                                max="6"
                                value={level}
                                onChange={e => setLevel(Number(e.target.value))}
                                required
                            />
                        </div>

                        {/* SUFFIXE */}
                        <div>
                            <div className="mb-2 block"><Label aria-label="Serie / Suffixe (ex: A, C, D)" /></div>
                            <TextInput
                                placeholder="A"
                                value={suffix}
                                onChange={e => setSuffix(e.target.value.toUpperCase())} // Force majuscule
                                required
                            />
                        </div>

                        {/* APERÇU EN TEMPS RÉEL */}
                        <div className="p-3 bg-gray-100 rounded text-center text-gray-700 font-medium">
                            Resulting name : <span className="text-blue-600 font-bold">{getLevelPrefix(level)} {suffix}</span>
                        </div>

                        <Button type="submit" color="blue" className="w-full">Save</Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};
export default ClassManager;