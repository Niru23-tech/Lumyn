
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { JournalEntry, Student } from '../types';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';

const CounselorStudentJournalView: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [student, setStudent] = useState<Student | null>(null);
    const [counselor, setCounselor] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<number | null>(null);

    useEffect(() => {
        if (!studentId) {
            setError("No student ID provided.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            setCounselor(user);

            // Fetch student details
            const { data: studentData, error: studentError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('id', studentId)
                .single();

            if (studentError || !studentData) {
                setError("Could not find student data.");
                setLoading(false);
                return;
            }
            setStudent({
                id: studentData.id,
                name: studentData.full_name || 'Student',
                avatar_url: studentData.avatar_url
            });

            // Fetch student's journal entries
            const { data: entriesData, error: entriesError } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('user_id', studentId)
                .order('created_at', { ascending: false });

            if (entriesError) {
                setError("Could not load journal entries.");
            } else {
                setEntries(entriesData);
            }
            setLoading(false);
        };

        fetchData();
    }, [studentId]);
    
    const toggleEntry = (id: number) => {
        setExpandedEntryId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="relative flex h-screen min-h-screen w-full flex-col bg-c-background-light dark:bg-background-dark overflow-hidden">
            <main className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-3 dark:border-slate-800 dark:bg-background-dark/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        {student && <UserAvatar avatarUrl={student.avatar_url} name={student.name} size="size-10" />}
                        <div>
                            <h2 className="text-text-light text-base font-bold leading-tight dark:text-white">
                                {loading ? 'Loading...' : `${student?.name}'s Journal` || 'Student Journal'}
                            </h2>
                            <p className="text-text-muted-light text-sm font-normal leading-normal dark:text-slate-400">Read-only view</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/counselor-dashboard" className="flex h-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4 dark:bg-slate-800 dark:text-slate-300">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span>Dashboard</span>
                        </Link>
                        {counselor && <UserAvatar avatarUrl={counselor?.user_metadata?.avatar_url} name={counselor?.user_metadata?.full_name} size="size-10" />}
                    </div>
                </header>

                {/* Journal List */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto flex max-w-3xl flex-col gap-4">
                        {loading ? (
                            <p className="text-center text-text-muted-light">Loading journal entries...</p>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        ) : entries.length === 0 ? (
                            <p className="text-center text-text-muted-light py-16">This student has no journal entries yet.</p>
                        ) : (
                            entries.map((entry) => (
                                <div key={entry.id} className="bg-white dark:bg-neutral-dark/40 rounded-xl border border-neutral-light dark:border-neutral-dark/80 overflow-hidden">
                                    <button onClick={() => toggleEntry(entry.id)} className="w-full flex items-center justify-between p-4 text-left">
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark">{entry.title}</h3>
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{new Date(entry.created_at).toLocaleString()}</p>
                                        </div>
                                        <span className={`material-symbols-outlined transition-transform text-text-muted-light ${expandedEntryId === entry.id ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                    {expandedEntryId === entry.id && (
                                        <div className="p-4 border-t border-neutral-light dark:border-neutral-dark bg-c-background-light dark:bg-neutral-dark/20">
                                            <p className="text-text-light dark:text-text-dark whitespace-pre-wrap">{entry.content}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CounselorStudentJournalView;
