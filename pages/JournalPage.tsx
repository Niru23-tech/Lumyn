import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { JournalEntry } from '../types';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '../components/UserAvatar';

const JournalPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry> | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndEntries = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data, error } = await supabase
                    .from('journal_entries')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error("Error fetching journal entries:", error);
                } else {
                    setEntries(data);
                }
            } else {
                navigate('/student-signin');
            }
            setLoading(false);
        };
        fetchUserAndEntries();
    }, [navigate]);

    const handleSelectEntry = (entry: JournalEntry) => {
        setCurrentEntry(entry);
    };

    const handleNewEntry = () => {
        setCurrentEntry({ id: undefined, title: '', content: '' });
    };

    const handleSaveEntry = async () => {
        if (!currentEntry || !currentEntry.title || !user) return;
        
        const entryToSave = {
            user_id: user.id,
            title: currentEntry.title,
            content: currentEntry.content,
        };

        if (currentEntry.id) { // Update existing entry
            const { data, error } = await supabase
                .from('journal_entries')
                .update(entryToSave)
                .eq('id', currentEntry.id)
                .select();
            if (error) console.error("Error updating entry:", error);
            else if (data) {
                setEntries(entries.map(e => e.id === data[0].id ? data[0] : e));
                setCurrentEntry(data[0]);
            }
        } else { // Create new entry
            const { data, error } = await supabase
                .from('journal_entries')
                .insert(entryToSave)
                .select();
            if (error) console.error("Error creating entry:", error);
            else if(data) {
                setEntries([data[0], ...entries]);
                setCurrentEntry(data[0]);
            }
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
                <div className="flex flex-col w-full max-w-6xl flex-1 gap-6">
                    {/* Header */}
                    <header className="flex items-center justify-between whitespace-nowrap bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-solid border-slate-200/50 dark:border-slate-800/50 px-6 py-3 rounded-xl sticky top-4 z-10">
                         <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="size-6 text-primary"><span className="material-symbols-outlined !text-3xl">psychology</span></div>
                            <h2 className="text-lg font-bold tracking-[-0.015em]">Lumyn</h2>
                        </Link>
                        <div className="hidden sm:flex flex-1 justify-center gap-8">
                            <Link to="/student-dashboard" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
                            <Link to="/journal" className="text-slate-900 dark:text-white text-sm font-medium">Journal</Link>
                            <Link to="/resources" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">Resources</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/student-profile">
                                <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                            </Link>
                        </div>
                    </header>
                    <main className="flex flex-1 gap-8 mt-4">
                        {/* Entry List */}
                        <aside className="w-1/3 max-w-xs flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Entries</h2>
                                <button onClick={handleNewEntry} className="flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2 text-sm font-semibold text-primary dark:text-blue-300 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                    <span className="material-symbols-outlined text-base">add</span>
                                    <span>New</span>
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex-1 overflow-y-auto">
                                {loading ? (
                                    <p className="text-slate-500 p-4 text-center">Loading entries...</p>
                                ) : entries.length === 0 ? (
                                    <p className="text-slate-500 text-center py-8 px-4">No entries yet. Start by creating a new one.</p>
                                ) : (
                                    <ul className="space-y-1">
                                        {entries.map(entry => (
                                            <li key={entry.id}>
                                                <button onClick={() => handleSelectEntry(entry)} className={`w-full text-left p-3 rounded-lg transition-colors ${currentEntry?.id === entry.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{entry.title}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</p>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </aside>

                        {/* Editor and Analysis */}
                        <section className="flex-1 flex flex-col gap-6">
                            {currentEntry ? (
                                <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                                    <input
                                        type="text"
                                        placeholder="A new day, a new thought..."
                                        value={currentEntry.title || ''}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                                        className="form-input w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 focus:ring-0 focus:border-primary p-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                    <textarea
                                        placeholder="Let your thoughts flow freely here. What's on your mind?"
                                        value={currentEntry.content || ''}
                                        onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                                        className="form-textarea w-full flex-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-4 text-slate-700 dark:text-slate-300 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                    <div className="flex justify-end gap-4 mt-2">
                                        <button onClick={handleSaveEntry} disabled={!currentEntry.title} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 disabled:opacity-50">
                                            {currentEntry.id ? 'Save Changes' : 'Save Entry'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 p-6 rounded-xl border-2 border-dashed border-slate-300/80 dark:border-slate-700/80">
                                    <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">auto_stories</span>
                                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-center">Select an entry to read, or create a new one to begin.</p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;