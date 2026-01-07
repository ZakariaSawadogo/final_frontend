import type {User} from "./User";
import type {ClassLevel} from "./ClassLevel";

export interface Course {
    id: number;
    name: string;
    coefficient: number;
    class_level_id: number;
    classLevel?: ClassLevel;
    teacher_id?: number;
    teacher?: User;
}