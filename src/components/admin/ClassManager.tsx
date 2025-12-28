import React, { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Table } from 'flowbite-react';
import { Api } from '../../helper/api';
import type {ClassLevel} from '../../types/ClassLevel';

const ClassManager = () => {
    const [classes, setClasses] = useState<ClassLevel[]>([]);
    const [newName, setNewName] = useState('');
    const [newLevel, setNewLevel] = useState(6);

    const fetchClasses = async () => {
        try {
            const data = await Api.getClassLevels();
            setClasses(data);
        } catch (err) { alert('Erreur chargement classes'); }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await Api.createClassLevel(newName, newLevel);
            setNewName('');
            fetchClasses();
        } catch (err) { alert('Erreur création classe'); }
    };

    return (
        <div>
            <Card className="mb-6">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Créer une nouvelle classe
                </h5>
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full">
                        <div className="mb-2 block"><Label value="Nom de la classe (ex: 6ème A)" /></div>
                        <TextInput value={newName} onChange={e => setNewName(e.target.value)} required />
                    </div>
                    <div className="w-full md:w-32">
                        <div className="mb-2 block"><Label value="Niveau" /></div>
                        <TextInput type="number" value={newLevel} onChange={e => setNewLevel(Number(e.target.value))} required />
                    </div>
                    <Button type="submit" color="success">Ajouter</Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {classes.map(c => (
                    <Card key={c.id} className="max-w-sm">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {c.name}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Niveau {c.level}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ClassManager;