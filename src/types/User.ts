import type {ProfileType} from "./ProfileType";
import type {ClassLevel} from "./ClassLevel";

export interface User {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    photo?: string;

    profile_type_id: number;
    profileType?: ProfileType;

    class_level_id?: number | null;
    classLevel?: ClassLevel;
}