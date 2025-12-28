import axios from 'axios';
import type {User} from '../types/User';
import type {Course} from '../types/Course';
import type {Grade} from '../types/Grade';
import type {ClassLevel} from '../types/ClassLevel';
import type {Bulletin} from '../types/Bulletin';
import type {ProfileType} from '../types/ProfileType';

// Configuration de base Axios
const api = axios.create({
    baseURL: 'http://localhost:3000', // Ton Backend NestJS
});

// Intercepteur pour ajouter le Token JWT automatiquement à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const Api = {
    // --- AUTHENTIFICATION ---
    login: async (username: string, password: string) => {
        const { data } = await api.post('/auth/login', { username, password });
        return data;
    },

    // --- UTILISATEURS (Admin) ---
    getAllUsers: async () => {
        const { data } = await api.get<User[]>('/users');
        return data;
    },
    createUser: async (user: Partial<User>) => {
        const { data } = await api.post<User>('/users', user);
        return data;
    },

    // --- RÔLES & CLASSES (Config) ---
    getProfileTypes: async () => {
        const { data } = await api.get<ProfileType[]>('/profile-types');
        return data;
    },
    getClassLevels: async () => {
        const { data } = await api.get<ClassLevel[]>('/class-levels');
        return data;
    },
    createClassLevel: async (name: string, level: number) => {
        const { data } = await api.post<ClassLevel>('/class-levels', { name, level });
        return data;
    },

    // --- COURS (Matières) ---
    getAllCourses: async () => {
        const { data } = await api.get<Course[]>('/courses');
        return data;
    },
    createCourse: async (course: Partial<Course>) => {
        // On attend { name, coefficient, classLevelId, teacherId }
        const { data } = await api.post<Course>('/courses', course);
        return data;
    },
    getCoursesByTeacher: async (teacherId: number) => {
        const { data } = await api.get<Course[]>(`/courses/teacher/${teacherId}`);
        return data;
    },

    // --- NOTES (Grades) ---
    initializeGrade: async (studentId: number, courseId: number, term: string) => {
        const { data } = await api.post<Grade>('/grades/initialize', { studentId, courseId, term });
        return data;
    },
    updateGrade: async (id: number, notes: { devoir1?: number; devoir2?: number; composition?: number }) => {
        const { data } = await api.patch<Grade>(`/grades/${id}`, notes);
        return data;
    },
    getGradesByStudent: async (studentId: number) => {
        const { data } = await api.get<Grade[]>(`/grades/student/${studentId}`);
        return data;
    },

    // --- BULLETINS ---
    generateBulletin: async (studentId: number, term: string) => {
        const { data } = await api.post<Bulletin>('/bulletins/generate', { studentId, term });
        return data;
    },
    getBulletinsByStudent: async (studentId: number) => {
        const { data } = await api.get<Bulletin[]>(`/bulletins/student/${studentId}`);
        return data;
    },
    getAnnualResult: async (studentId: number) => {
        const { data } = await api.get(`/bulletins/annual-result/${studentId}`);
        return data;
    }
};