import { useState, type ReactNode } from 'react';
import { Avatar, Button, Tooltip } from 'flowbite-react';
import { HiLogout, HiMenu, HiPencilAlt, HiViewGrid } from 'react-icons/hi';
import type { User } from '../types/User';
import EditProfileModal from './EditProfileModal';

interface Props {
    children: ReactNode;
    user: User;
    title: string;
    onLogout: () => void;
}

const SidebarLayout = ({ children, user, title, onLogout }: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">

            {/* SIDEBAR GAUCHE (Dorée & Rétractable) */}
            <div className={`${collapsed ? 'w-20' : 'w-64'} h-full bg-amber-300 border-r border-amber-400 flex flex-col shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out`}>

                {/* BOUTON COLLAPSE (En haut à droite) */}
                <div className={`p-2 flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
                    <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-amber-400/50 rounded-lg text-amber-900 transition">
                        <HiMenu className="h-6 w-6" />
                    </button>
                </div>

                {/* PROFIL */}
                <div className="flex flex-col items-center justify-center p-4 border-b border-amber-400/50">
                    <div className={`transition-all duration-300 ${collapsed ? 'mb-2' : 'mb-3 ring-4 ring-white/50 rounded-full'}`}>
                        <Avatar
                            img={user.photo || undefined}
                            size={collapsed ? 'sm' : 'lg'}
                            rounded
                            placeholderInitials={user.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                        />
                    </div>

                    {!collapsed && (
                        <div className="text-center w-full animate-fade-in">
                            <h2 className="text-lg font-bold text-gray-900 truncate px-2">{user.username}</h2>
                            <span className="mt-1 inline-block px-2 py-0.5 text-xs font-bold text-amber-900 bg-amber-100 rounded-full">
                                {user.profileType?.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* MENU */}
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                    {!collapsed ? (
                        <div className="p-4 bg-white/30 rounded-lg border border-white/20 text-sm text-amber-900 shadow-sm">
                            <p className="font-semibold">Tableau de bord</p>
                            <p className="text-xs mt-1">Will be added in next update</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Tooltip content="Tableau de bord">
                                <HiViewGrid className="h-8 w-8 text-amber-900 opacity-50"/>
                            </Tooltip>
                        </div>
                    )}
                </div>

                {/* FOOTER (BOUTONS ACTIONS) */}
                <div className="p-4 border-t border-amber-400/50 flex flex-col gap-3">

                    {/* BOUTON MODIFIER INFOS (Style similaire à Logout) */}
                    <Button color="lime" onClick={() => setShowModal(true)} className="w-full justify-center shadow-sm border-none bg-white/50 hover:bg-white text-amber-900">
                        <HiPencilAlt className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
                        {!collapsed && "Modify my profile"}
                    </Button>

                    {/* BOUTON DECONNEXION */}
                    <Button color="red" onClick={onLogout} className="w-full justify-center shadow-md">
                        <HiLogout className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
                        {!collapsed && "Deconnect"}
                    </Button>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="bg-white shadow-sm p-4 border-b border-gray-200 h-16 flex items-center shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>

            {/* MODAL (Invisible tant qu'on ne clique pas) */}
            <EditProfileModal user={user} show={showModal} onClose={() => setShowModal(false)} />

        </div>
    );
};

export default SidebarLayout;