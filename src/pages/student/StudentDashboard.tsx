import { useEffect, useState, useContext } from 'react';
import { Card, Table, Badge, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiAcademicCap, HiChartPie, HiTrendingUp } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import { Api } from '../../helper/api';
import type { Grade } from '../../types/Grade';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [generalAvg, setGeneralAvg] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            Api.getGradesByStudent(user.id).then(setGrades);
            Api.getStudentGeneralAverage(user.id).then(res => {
                if (res && res.general_average !== undefined) setGeneralAvg(res.general_average);
            }).catch(() => setGeneralAvg(null));
        }
    }, [user]);

    // Calculs pour les statistiques
    const passedCount = grades.filter(g => (g.average || 0) >= 10).length;
    const this_year=new Date().getFullYear();

    return (
        <div className="space-y-8 animate-fade-in">

            {/* EN-TÊTE : STATISTIQUES GLOBALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Carte Moyenne Générale */}
                <Card className={`relative overflow-hidden border-none shadow-lg text-white ${generalAvg && generalAvg >= 10 ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-rose-700'}`}>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h5 className="text-lg font-medium opacity-90">General Average</h5>
                                <p className="text-sm opacity-75">School Year {this_year-1} - {this_year}</p>
                            </div>
                            <HiChartPie className="text-4xl opacity-50" />
                        </div>
                        <div className="mt-4">
                            <span className="text-5xl font-bold tracking-tight">{generalAvg !== null ? Number(generalAvg).toFixed(2) : '--'}</span>
                            <span className="text-xl ml-1 opacity-80">/ 20</span>
                        </div>
                        <div className="mt-2 inline-flex items-center bg-white/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
                            <span className="text-sm font-semibold">{generalAvg !== null ? (generalAvg >= 10 ? '🎉 PASSING' : '⚠️ NON PASSING') : 'WAITING'}</span>
                        </div>
                    </div>
                </Card>

                {/* 2. Carte Infos Élève */}
                <Card className="border-l-4 border-blue-500 shadow-md ">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <HiAcademicCap className="text-3xl" />
                        </div>
                        <div>
                            <h5 className="text-lg font-bold text-gray-400">My profile</h5>
                            <p className="text-gray-600">Class : <span className="font-bold text-blue-600">{user?.classLevel?.name}</span></p>
                            <p className="text-xs text-gray-500 mt-1">Username : {user?.username}</p>
                        </div>
                    </div>
                </Card>

                {/* 3. Carte Performance */}
                <Card className="border-l-4 border-purple-500 shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <HiTrendingUp className="text-3xl" />
                        </div>
                        <div>
                            <h5 className="text-lg font-bold text-gray-400">Performance</h5>
                            <p className="text-gray-600">Course passed : <span className="font-bold text-green-600">{passedCount}</span> / {grades.length}</p>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${grades.length > 0 ? (passedCount / grades.length) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* TABLEAU DES NOTES DÉTAILLÉ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Grade report</h3>
                        <p className="text-sm text-gray-500">Details by Subject</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {grades.length === 0 ? <div className="p-10 text-center text-gray-500">Not a single grade available yet.</div> : (
                        <Table hoverable>
                            <TableHead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <TableHeadCell>Matière</TableHeadCell>
                                <TableHeadCell className="text-center">Coef</TableHeadCell>
                                <TableHeadCell className="text-center">Mid-Term1</TableHeadCell>
                                <TableHeadCell className="text-center">Mid-Term2</TableHeadCell>
                                <TableHeadCell className="text-center">Final</TableHeadCell>
                                <TableHeadCell className="text-center">Average</TableHeadCell>
                                <TableHeadCell className="text-center">Statut</TableHeadCell>
                            </TableHead>
                            <TableBody className="divide-y text-gray-700">
                                {grades.map(g => (
                                    <TableRow key={g.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-bold text-gray-900 border-r border-gray-100">{g.course?.name}</TableCell>
                                        <TableCell className="text-center font-medium bg-gray-50/50">{g.course?.coefficient}</TableCell>
                                        <TableCell className="text-center">{g.devoir1 ?? <span className="text-gray-300">-</span>}</TableCell>
                                        <TableCell className="text-center">{g.devoir2 ?? <span className="text-gray-300">-</span>}</TableCell>
                                        <TableCell className="text-center font-semibold text-blue-600 bg-blue-50/30">{g.composition ?? <span className="text-gray-300">-</span>}</TableCell>
                                        <TableCell className="text-center font-bold">
                                            {g.average
                                                ? <span className={g.average >= 10 ? "text-green-600" : "text-red-600"}>{Number(g.average).toFixed(2)}</span>
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {g.average ? (
                                                g.average >= 10
                                                    ? <Badge color="green" className="justify-center">Passed</Badge>
                                                    : <Badge color="red" className="justify-center">Failed</Badge>
                                            ) : <Badge color="gray" className="justify-center">In process</Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
};
export default StudentDashboard;
