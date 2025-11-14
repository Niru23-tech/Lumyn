
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../services/supabaseClient';
import { MoodLog } from '../types';
import MoodLoggerModal from '../components/MoodLoggerModal';
import UserAvatar from '../components/UserAvatar';

const processMoodData = (logs: MoodLog[]) => {
    if (!logs || logs.length === 0) {
        return [{ name: 'Start', mood: 3 }];
    }
    // Sort logs by date to ensure the chart makes sense
    const sortedLogs = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sortedLogs.map(log => ({
        name: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: log.mood,
    }));
};

const StudentDashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data, error: dbError } = await supabase
                    .from('mood_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(30);
                
                if (dbError) throw dbError;
                
                setMoodLogs(data || []);
            }
        } catch (err: any) {
            console.error("Error fetching mood logs:", err.message || err);
            setError("Could not load mood data. Please ensure your database is configured.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSaveMood = async (mood: number) => {
        if (!user) return;

        const { error } = await supabase.from('mood_logs').insert({
            user_id: user.id,
            mood: mood,
            created_at: new Date().toISOString(),
        });

        if (error) {
            setError("Failed to save mood. Please try again.");
            console.error(error);
        } else {
            // Refresh data to show the new mood log
            await fetchUserData();
            setIsModalOpen(false);
        }
    };

    const chartData = processMoodData(moodLogs);
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

    return (
        <>
            <MoodLoggerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMood}
            />
            <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
                <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="flex flex-col max-w-[960px] flex-1 gap-6">
                        {/* TopNavBar */}
                        <header className="flex items-center justify-between whitespace-nowrap bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-solid border-slate-200/50 dark:border-slate-800/50 px-6 py-3 rounded-xl sticky top-4 z-10">
                            <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="size-6 text-primary">
                                    <span className="material-symbols-outlined !text-3xl">psychology</span>
                                </div>
                                <h2 className="text-lg font-bold tracking-[-0.015em]">Lumyn</h2>
                            </Link>
                            <div className="hidden sm:flex flex-1 justify-center gap-8">
                                <div className="flex items-center gap-8">
                                    <Link to="/student-dashboard" className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Dashboard</Link>
                                    <Link to="/journal" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Journal</Link>
                                    <Link to="/resources" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Resources</Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link to="/student-profile">
                                    <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                                </Link>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="sm:hidden text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                                </button>
                            </div>
                        </header>
                        
                        {isMenuOpen && (
                            <nav className="sm:hidden bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-xl p-4 -mt-4 border border-slate-200/50 dark:border-slate-800/50">
                                <ul className="flex flex-col gap-2">
                                    <li><Link to="/student-dashboard" className="block p-2 rounded-md bg-primary/10 text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                                    <li><Link to="/journal" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Journal</Link></li>
                                    <li><Link to="/resources" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Resources</Link></li>
                                </ul>
                            </nav>
                        )}


                        <main className="flex flex-col gap-8 mt-4">
                            <div className="flex flex-wrap justify-between gap-4 p-4 items-center">
                                <div className="flex flex-col gap-2">
                                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Good morning, {userName}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Remember to be kind to yourself today. We're here to support you.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Your Mood Journey</h2>
                                        </div>
                                        {error && <p className="text-sm text-red-500 mt-4 -mb-2">{error}</p>}
                                        <div className="flex flex-wrap gap-4 py-6">
                                            <div className="flex w-full flex-1 flex-col gap-2">
                                                <div className="flex min-h-[220px] flex-1 flex-col gap-8 py-4">
                                                    {loading ? (
                                                        <div className="flex items-center justify-center h-full text-slate-500">Loading chart...</div>
                                                    ) : (
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                                                <defs>
                                                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="5%" stopColor="#306ee8" stopOpacity={0.4}/>
                                                                        <stop offset="95%" stopColor="#306ee8" stopOpacity={0}/>
                                                                    </linearGradient>
                                                                </defs>
                                                                <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                                <YAxis tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} />
                                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" />
                                                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ccc', borderRadius: '0.5rem' }} />
                                                                <Area type="monotone" dataKey="mood" stroke="#306ee8" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-end">
                                            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm font-semibold text-primary dark:text-blue-300 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                                <span className="material-symbols-outlined text-base">add_circle</span>
                                                <span>Log Today's Mood</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1 flex flex-col gap-8">
                                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-4">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">How can we help you today?</h3>
                                        <div className="flex flex-col gap-3">
                                            <Link to="/chat" className="flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary dark:text-blue-300">
                                                    <span className="material-symbols-outlined">chat_bubble</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Chat with AI Companion</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Get instant, confidential support</p>
                                                </div>
                                            </Link>
                                            <Link to="/book-appointment" className="flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-center justify-center size-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                                                    <span className="material-symbols-outlined">calendar_month</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Book a Session</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect with a counselor</p>
                                                </div>
                                            </Link>
                                            <Link to="/resources" className="flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-center justify-center size-10 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300">
                                                    <span className="material-symbols-outlined">self_improvement</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-100">Mindfulness Activities</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Find calm and focus</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-4">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Something For You</h3>
                                        <div className="flex flex-col gap-4">
                                            <div className="aspect-[16/9] rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqT83rts7Yk7FlMTSRyMEcyrsKr1rvTxF4erwZ7QM1j1ai4P1iNSvHleqOWYaOySgC2cw9bS36Lh1aND6h9ioO5MvpNYCi13f_KerWqd0ROGTkYBqBD0gk-L2H0Ev9Cn5fhWTp6eWed7SJDPxMsSbOCQ3IsHqO55tsJQzhKLRbgH63N2DdxbqqxrDcBNj0pK7JpAiCA1-r4KlTz5cFECSqOcSeORF4JIsKflHTZjX7s1A2IOS5PXl4An58hVRVIkA7Lov46lU4L0c')" }}></div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-semibold text-slate-800 dark:text-slate-100">5-Minute Breathing Exercise</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">A quick way to find your center and reduce stress before your next class.</p>
                                            </div>
                                            <Link to="/resources" className="text-sm font-semibold text-primary dark:text-blue-400 hover:underline">Learn More</Link>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentDashboard;