
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Student, Appointment } from '../types';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';

const CounselorDashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'dashboard' | 'students'>('dashboard');

    const fetchData = useCallback(async (currentUser: User) => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all appointments related to this counselor
            const { data: apptData, error: apptError } = await supabase
                .from('appointments')
                .select('*, profiles(full_name, avatar_url)')
                .eq('counselor_id', currentUser.id);

            if (apptError) throw apptError;
            setAppointments(apptData || []);

            // Fetch all students
            const { data: studentData, error: studentError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('role', 'student');
            
            if (studentError) throw studentError;
            const studentsList = studentData.map(p => ({ id: p.id, name: p.full_name || 'Student', avatar_url: p.avatar_url }));
            setStudents(studentsList);

        } catch (err: any) {
            console.error("Dashboard Error:", err);
            setError("Failed to load dashboard data. Please check database permissions.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const getInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchData(user);
            } else {
                setLoading(false);
            }
        };
        getInitialData();
    }, [fetchData]);

    const handleAppointmentStatusChange = async (appointmentId: number, newStatus: 'confirmed' | 'declined') => {
        if (!user) return;
        
        // Optimistically update UI
        setAppointments(prev => prev.map(a => a.id === appointmentId ? {...a, status: newStatus} : a));

        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', appointmentId);

        if (error) {
            console.error("Error updating appointment:", error);
            setError("Failed to update appointment. Please try again.");
            // Revert optimistic update on error
            if (user) await fetchData(user);
        }
    };
    
    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');

    const StatCard: React.FC<{ icon: string, value: number, label: string, color: string }> = ({ icon, value, label, color }) => (
        <div className="flex-1 bg-white dark:bg-neutral-dark/40 p-6 rounded-xl shadow-soft flex items-center gap-5 border border-neutral-light dark:border-neutral-dark/80">
            <div className={`flex items-center justify-center size-12 rounded-full ${color}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-3xl font-bold text-text-light dark:text-text-dark">{value}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</p>
            </div>
        </div>
    );
    
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-c-background-light dark:bg-background-dark">
            <div className="flex flex-1 justify-center py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-7xl flex-1 gap-8">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-light dark:border-neutral-dark px-6 py-4">
                        <Link to="/" className="flex items-center gap-4 text-text-light dark:text-text-dark">
                            <div className="size-6 text-c-primary"><span className="material-symbols-outlined !text-3xl">psychology</span></div>
                            <h2 className="text-text-light dark:text-text-dark text-xl font-bold">Lumyn for Counselors</h2>
                        </Link>
                        <div className="flex flex-1 justify-end items-center gap-6">
                             <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                        </div>
                    </header>
                    <main className="flex flex-col gap-8 px-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Counselor'}</h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Here's your overview for today.</p>
                        </div>

                         {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                        
                        <div className="flex flex-wrap gap-6">
                            <StatCard icon="pending_actions" value={pendingAppointments.length} label="Pending Requests" color="bg-orange-100 text-orange-600" />
                            <StatCard icon="event_upcoming" value={upcomingAppointments.length} label="Upcoming Sessions" color="bg-blue-100 text-blue-600" />
                            <StatCard icon="groups" value={students.length} label="Total Students" color="bg-green-100 text-green-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Appointment Requests</h2>
                                <div className="bg-white dark:bg-neutral-dark/40 rounded-xl shadow-soft border border-neutral-light dark:border-neutral-dark/80 p-4 space-y-4">
                                    {loading ? <p>Loading requests...</p> : pendingAppointments.length === 0 ? (
                                        <p className="text-text-muted-light dark:text-text-muted-dark text-center py-8">No pending appointment requests.</p>
                                    ) : (
                                        pendingAppointments.map(appt => (
                                            <div key={appt.id} className="flex flex-wrap items-center justify-between p-4 bg-c-background-light dark:bg-neutral-dark/50 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <UserAvatar avatarUrl={appt.profiles?.avatar_url} name={appt.profiles?.full_name} size="size-10" />
                                                    <div>
                                                        <p className="font-semibold text-text-light dark:text-text-dark">{appt.profiles?.full_name}</p>
                                                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Requested on {new Date(appt.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3 sm:mt-0">
                                                    <button onClick={() => handleAppointmentStatusChange(appt.id, 'confirmed')} className="px-4 py-2 text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Approve</button>
                                                    <button onClick={() => handleAppointmentStatusChange(appt.id, 'declined')} className="px-4 py-2 text-sm font-bold bg-slate-200 dark:bg-slate-600 text-text-light dark:text-text-dark rounded-lg hover:bg-slate-300 transition">Decline</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="lg:col-span-1 flex flex-col gap-6">
                                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Upcoming Sessions</h2>
                                <div className="bg-white dark:bg-neutral-dark/40 rounded-xl shadow-soft border border-neutral-light dark:border-neutral-dark/80 p-4 space-y-3">
                                   {loading ? <p>Loading sessions...</p> : upcomingAppointments.length === 0 ? (
                                        <p className="text-text-muted-light dark:text-text-muted-dark text-center py-8">No upcoming sessions.</p>
                                    ) : (
                                        upcomingAppointments.map(appt => (
                                            <div key={appt.id} className="flex items-center gap-4 p-3 bg-c-background-light dark:bg-neutral-dark/50 rounded-lg">
                                                <UserAvatar avatarUrl={appt.profiles?.avatar_url} name={appt.profiles?.full_name} size="size-10" />
                                                <div>
                                                    <p className="font-semibold text-text-light dark:text-text-dark">{appt.profiles?.full_name}</p>
                                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Confirmed for next week</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                         <div className="flex flex-col gap-6">
                             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">All Students</h2>
                             <div className="bg-white dark:bg-neutral-dark/40 rounded-xl shadow-soft border border-neutral-light dark:border-neutral-dark/80 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-c-background-light dark:bg-neutral-dark/50"><th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {loading ? <tr><td colSpan={2} className="text-center p-4">Loading...</td></tr> : students.map(student => (
                                            <tr key={student.id} className="border-t border-neutral-light dark:border-neutral-dark">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <UserAvatar avatarUrl={student.avatar_url} name={student.name} size="size-10" />
                                                        <span className="font-semibold">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Link to={`/counselor/student-chat/${student.id}`} className="px-4 py-2 text-sm font-bold bg-c-primary text-white rounded-lg hover:bg-opacity-90 transition">View Chat</Link>
                                                </td>
                                            </tr>
                                        ))}
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
