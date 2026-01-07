import type {User} from "./User";
import type {Course} from "./Course";

export interface Grade {
    id: number;
    term: string;
    student_id: number;
    student?: User;
    course_id: number;
    course?: Course;
    devoir1?: number;
    devoir2?: number;
    composition?: number;
    average?: number;
}