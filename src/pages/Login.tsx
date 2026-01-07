import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../helper/api';
import { AuthContext } from '../context/AuthContext';
import { Card, Button, Label, TextInput } from 'flowbite-react';
import { HiUser, HiLockClosed, HiAcademicCap } from 'react-icons/hi';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await Api.login(username, password);
            login(data.access_token, data.user);
            navigate('/dashboard');
        } catch (err:any) {
            alert(err.response.data.message || 'Wrong username or password.Please retry!!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-900 p-4">

            {/* Carte de Connexion */}
            <Card className="w-full max-w-md shadow-2xl border-none">

                {/* En-tête avec Logo */}
                <div className="flex flex-col items-center mb-4 space-y-2">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <HiAcademicCap className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        School Management System
                    </h2>
                    <p className="text-sm text-gray-500 text-center">
                        Connecte to school management system with your credentials.
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Champ Username */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username" />
                        </div>
                        <TextInput
                            id="username"
                            type="text"
                            icon={HiUser}
                            placeholder="Ex: jean.dupont"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Champ Password */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            icon={HiLockClosed}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        color="blue"
                        className="w-full mt-2 shadow-md transition-transform active:scale-95"
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : "Connect"}
                    </Button>
                </form>

                {/* Pied de carte */}
                <div className="mt-4 text-center text-xs text-gray-400">
                    © 2026 Zackson Technologies. Tous droits réservés.
                </div>
            </Card>
        </div>
    );
};

export default Login;