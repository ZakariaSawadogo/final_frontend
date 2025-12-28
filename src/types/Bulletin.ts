export interface Bulletin {
    id: number;
    student_id: number;
    academic_year: string;
    term: string;
    general_average: number;
    status: string; // 'PASSED', 'WARNING'
}