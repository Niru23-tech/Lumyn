
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Student } from '../types';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';

const RlsHelpMessage: React.FC = () => (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-6 rounded-xl" role="alert">
        <div className="flex">
            <div className="py-1">
                <span className="material-symbols-outlined text-orange-500 mr-4 text-3xl">database</span>
            </div>
            <div>
                <p className="font-bold text-lg">Database Configuration Required</p>
                <p className="mt-2">
                    This page cannot load student data because of a database permission issue. This is a common, one-time setup step for new Lumyn projects.
                </p>
                <p className="mt-3 text-sm">
                    <b className="block">To Fix This Error:</b>
                    Open the developer console (press F12), find the error message from this page, and copy the SQL script provided. Run that script in your Supabase project's SQL Editor to grant the necessary permissions.
                </p>
            </div>
        </div>
    </div>
);


const CounselorDashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRlsError, setIsRlsError] = useState(false);

    useEffect(() => {
        const fetchUserAndStudents = async () => {
            setLoading(true);
            setError(null);
            setIsRlsError(false);
            
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            const { data, error: dbError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('role', 'student');

            if (dbError) {
                const isPermissionError = dbError.message.toLowerCase().includes('policy') || dbError.code === '42501';
                if (isPermissionError) {
                    setIsRlsError(true);
                    setError("Database permission error.");
                    console.error("Supabase RLS Error. See master SQL script for the fix.");
                } else {
                    setError(`An unexpected database error occurred: ${dbError.message}`);
                }
            } else if (data) {
                const studentData = data.map(profile => ({ 
                    id: profile.id, 
                    name: profile.full_name || 'Unnamed Student',
                    avatar_url: profile.avatar_url 
                }));
                setStudents(studentData);
            }
            setLoading(false);
        };
        fetchUserAndStudents();
    }, []);


    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-c-background-light dark:bg-background-dark">
            <div className="flex flex-1 justify-center py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-6xl flex-1 gap-8">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-light dark:border-neutral-dark px-6 py-4">
                        <Link to="/" className="flex items-center gap-4 text-text-light dark:text-text-dark">
                            <div className="size-6 text-c-primary">
                                 <span className="material-symbols-outlined !text-3xl">psychology</span>
                            </div>
                            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Lumyn</h2>
                        </Link>
                        <div className="flex flex-1 justify-end items-center gap-6">
                            <div className="hidden md:flex items-center gap-8">
                                <Link to="/counselor-dashboard" className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-c-primary dark:hover:text-c-primary transition-colors">Dashboard</Link>
                                <Link to="/counselor-dashboard" className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-c-primary dark:hover:text-c-primary transition-colors">My Students</Link>
                                <Link to="/counselor-dashboard" className="text-text-light dark:text-text-dark text-sm font-medium leading-normal hover:text-c-primary dark:hover:text-c-primary transition-colors">Calendar</Link>
                            </div>
                            <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                        </div>
                    </header>
                    <main className="flex flex-col gap-6 px-4 py-3">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-[-0.03em]">Student Overview</p>
                                <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal">A list of all students on the platform.</p>
                            </div>
                            <label className="flex flex-col min-w-40 h-12 w-full max-w-sm">
                                <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-soft">
                                    <div className="text-text-muted-light dark:text-text-muted-dark flex bg-white dark:bg-neutral-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-white dark:bg-neutral-dark focus:border-none h-full placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark px-4 pl-2 text-base font-normal leading-normal" placeholder="Search for a student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </label>
                        </div>

                        {isRlsError ? <RlsHelpMessage /> : error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-xl relative" role="alert">
                                <strong className="font-bold">Database Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col bg-white dark:bg-neutral-dark/20 rounded-xl shadow-soft">
                            <div className="overflow-x-auto rounded-xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-c-background-light dark:bg-neutral-dark/50">
                                            <th className="px-6 py-4 text-left text-text-light dark:text-text-dark text-sm font-medium leading-normal">Student Name</th>
                                            <th className="px-6 py-4 text-left text-text-light dark:text-text-dark text-sm font-medium leading-normal">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-light dark:divide-neutral-dark">
                                        {loading ? (
                                             <tr><td colSpan={2} className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Loading students...</td></tr>
                                        ) : isRlsError ? (
                                            <tr><td colSpan={2} className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Could not load student list. Please resolve the database configuration issue.</td></tr>
                                        ) : error ? (
                                             <tr><td colSpan={2} className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Could not load student list due to an error.</td></tr>
                                        ) : filteredStudents.length === 0 ? (
                                            <tr><td colSpan={2} className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">No students found.</td></tr>
                                        ) : (
                                            filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-c-background-light dark:hover:bg-neutral-dark/30 transition-colors">
                                                    <td className="h-[80px] px-6 py-2 text-text-light dark:text-text-dark text-sm font-medium leading-normal">
                                                        <div className="flex items-center gap-4">
                                                            <UserAvatar avatarUrl={student.avatar_url} name={student.name} size="size-10" />
                                                            <span>{student.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="h-[80px] px-6 py-2 text-sm font-bold leading-normal tracking-[0.015em]">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`/counselor/student-chat/${student.id}`}
                                                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-c-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
                                                                <span className="truncate">View Chat</span>
                                                            </Link>
                                                            <button onClick={() => alert('Scheduling feature is coming soon!')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-neutral-light dark:bg-neutral-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-opacity">
                                                                <span className="truncate">Schedule Call</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
