
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Counselor } from '../types';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '../components/UserAvatar';

const counselorImages = [
    "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-39b533072b2c?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1975&auto=format&fit=crop"
];

const counselorTitles = ["PhD, LPC", "LCSW", "PsyD", "LMFT"];

const CounselorCard: React.FC<{ counselor: Counselor, onBook: (counselor: Counselor) => void }> = ({ counselor, onBook }) => (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-soft flex flex-col items-center text-center p-6 gap-4">
        <div className="size-32 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${counselor.imageUrl})` }}></div>
        <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{counselor.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{counselor.title}</p>
        </div>
        <button onClick={() => onBook(counselor)} className="flex w-full mt-2 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
            Book Session
        </button>
    </div>
);


const BookAppointmentPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCounselors = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (!user) {
                navigate('/student-signin');
                return;
            }

            setLoading(true);
            const { data, error: dbError } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('role', 'counselor');
            
            if (dbError) {
                console.error("Error fetching counselors:", dbError);
                setError("Could not load available counselors.");
            } else if (data) {
                const counselorData = data.map((profile, index) => ({
                    id: profile.id,
                    name: profile.full_name || 'Unnamed Counselor',
                    imageUrl: counselorImages[index % counselorImages.length],
                    title: counselorTitles[index % counselorTitles.length]
                }));
                setCounselors(counselorData);
            }
            setLoading(false);
        };
        fetchCounselors();
    }, [navigate]);

    const handleBook = async (counselor: Counselor) => {
        if (!user) {
            setError("You must be logged in to book an appointment.");
            return;
        }

        setError(null);
        setSuccessMessage(null);

        const { error: insertError } = await supabase
            .from('appointments')
            .insert({
                student_id: user.id,
                counselor_id: counselor.id,
                status: 'pending'
            });
        
        if (insertError) {
            console.error("Error creating appointment:", insertError);
            setError(`Could not send request. Please try again. (${insertError.message})`);
        } else {
            setSuccessMessage(`Your appointment request with ${counselor.name} has been sent. They will contact you via email to confirm a time.`);
            setTimeout(() => setSuccessMessage(null), 5000); // Reset after 5 seconds
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
                            <Link to="/journal" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">Journal</Link>
                            <Link to="/resources" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">Resources</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/student-profile">
                                <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                            </Link>
                        </div>
                    </header>
                    <main className="flex flex-col gap-8 mt-4">
                         <div className="text-center">
                            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Book a Session</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">Connect with a certified counselor. Your sessions are confidential and secure.</p>
                        </div>
                        
                        {successMessage && (
                            <div className="bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl relative text-center" role="alert">
                                <strong className="font-bold">Success! </strong>
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl relative text-center" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                           {loading ? <p className="text-slate-500 col-span-full text-center">Loading available counselors...</p> 
                           : counselors.length === 0 ? <p className="text-slate-500 col-span-full text-center">No counselors are available at this time.</p>
                           : counselors.map(c => <CounselorCard key={c.id} counselor={c} onBook={handleBook} />)
                           }
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentPage;
