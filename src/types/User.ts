import type {ProfileType} from "./ProfileType";
import type {ClassLevel} from "./ClassLevel";

export interface User {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    password?: string; // Optionnel à l'envoi

    profile_type_id: number;
    profileType?: ProfileType;

    // Spécifique Élève
    class_level_id?: number | null;
    classLevel?: ClassLevel;
}