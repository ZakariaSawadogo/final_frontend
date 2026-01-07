import React, { useState } from 'react';
import {Modal, Button, Label, TextInput, FileInput, ModalHeader, ModalBody} from 'flowbite-react';
import { Api } from '../helper/api';
import type { User } from '../types/User';

interface Props {
    user: User;
    show: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ user, show, onClose }: Props) => {
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [photo, setPhoto] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (password) formData.append('password', password);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            if (photo) formData.append('photo', photo);

            await Api.updateUser(user.id, formData);
            alert("Profile updated ! Please reload the page.");
            onClose();
        } catch (err) { alert("Error updating profile."); }
    };

    return (
        <Modal show={show} onClose={onClose} size="md">
            <ModalHeader>Modify my profile</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label aria-label="Surname" /><TextInput value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                    <div><Label aria-label="Name" /><TextInput value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                    <div><Label aria-label="New password" /><TextInput type="password" placeholder="•••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
                    <div><Label aria-label="Photo" /><FileInput onChange={e => setPhoto(e.target.files ? e.target.files[0] : null)} /></div>
                    <Button type="submit" color="purple" className="w-full">Enregistrer</Button>
                </form>
            </ModalBody>
        </Modal>
    );
};
export default EditProfileModal;