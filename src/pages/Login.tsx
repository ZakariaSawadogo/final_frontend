import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../helper/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await Api.login(username, password);
            // data contient { access_token, user }
            login(data.access_token, data.user);
            navigate('/dashboard'); // On envoie tout le monde vers le Dashboard
        } catch (err) {
            setError('Identifiants incorrects');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">Connexion École</h2>

                {error && <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Utilisateur</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
};

export default Login;