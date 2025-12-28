import type {User} from "./User";
import type {Course} from "./Course";

export interface Grade {
    id: number;
    term: string; // 'T1', 'T2', 'T3'

    student_id: number;
    student?: User;

    course_id: number;
    course?: Course;

    devoir1?: number;
    devoir2?: number;
    composition?: number;
    average?: number;
}