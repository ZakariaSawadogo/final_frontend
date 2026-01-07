import axios from 'axios';
import type {User} from '../types/User';
import type {Course} from '../types/Course';
import type {Grade} from '../types/Grade';
import type {ClassLevel} from '../types/ClassLevel';
import type {ProfileType} from '../types/ProfileType';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ||'http://localhost:3000' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const Api = {
    login: async (u: string, p: string) => (await api.post('/auth/login', { username: u, password: p })).data,

    // USERS
    getAllUsers: async () => (await api.get<User[]>('/users')).data,
    createUser: async (fd: FormData) => (await api.post<User>('/users', fd)).data,
    updateUser: async (id: number, fd: FormData) => (await api.patch<User>(`/users/${id}`, fd)).data,
    deleteUser: async (id: number) => (await api.delete(`/users/${id}`)).data,

    // CONFIG
    getProfileTypes: async () => (await api.get<ProfileType[]>('/profile-types')).data,

    // CLASSES
    getClassLevels: async () => (await api.get<ClassLevel[]>('/class-levels')).data,
    createClassLevel: async (name: string, level: number) => (await api.post('/class-levels', { name, level })).data,
    updateClassLevel: async (id: number, name: string, level: number) => (await api.patch(`/class-levels/${id}`, { name, level })).data,
    deleteClassLevel: async (id: number) => (await api.delete(`/class-levels/${id}`)).data,

    // COURSES
    getAllCourses: async () => (await api.get<Course[]>('/courses')).data,
    getCoursesByTeacher: async (id: number) => (await api.get<Course[]>(`/courses/teacher/${id}`)).data,
    getCoursesByClass: async (id: number) => (await api.get<Course[]>(`/courses/class/${id}`)).data,
    createCourse: async (c: Partial<Course>) => (await api.post('/courses', c)).data,
    updateCourse: async (id: number, c: Partial<Course>) => (await api.patch(`/courses/${id}`, c)).data,
    deleteCourse: async (id: number) => (await api.delete(`/courses/${id}`)).data,

    // GRADES
    initializeGrade: async (sid: number, cid: number) => (await api.post<Grade>('/grades/initialize', { studentId: sid, courseId: cid })).data,
    updateGrade: async (id: number, notes: any) => (await api.patch<Grade>(`/grades/${id}`, notes)).data,
    getGradesByStudent: async (id: number) => (await api.get<Grade[]>(`/grades/student/${id}`)).data,
    getStudentGeneralAverage: async (id: number) => (await api.get<{general_average: number}>(`/grades/result/${id}`)).data,
};