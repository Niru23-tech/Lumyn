
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';
import UserAvatar from '../components/UserAvatar';

const StudentProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata.full_name || '');
                setEmail(user.email || '');
            } else {
                navigate('/student-signin');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { data: { user: updatedUser }, error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });

        if (error) {
            setError(error.message);
        } else if (updatedUser) {
            // Also update the public profiles table
            const { error: profileError } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', updatedUser.id);
            if(profileError) {
                setError(profileError.message)
            } else {
                 setSuccess("Profile updated successfully! The page will now refresh.");
                 // update user state to reflect changes immediately
                 setUser(updatedUser);
                 // Reload to reflect changes everywhere
                 setTimeout(() => {
                    window.location.reload();
                 }, 1500);
            }
        }

        setLoading(false);
    };

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        navigate('/');
    };

    if (!user) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
                <div className="flex flex-col w-full max-w-[960px] flex-1 gap-6">
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
                                <Link to="/student-dashboard" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Dashboard</Link>
                                <Link to="/journal" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Journal</Link>
                                <Link to="/resources" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium leading-normal">Resources</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/student-profile">
                               <div className="ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark rounded-full">
                                    <UserAvatar avatarUrl={user.user_metadata.avatar_url} name={user.user_metadata.full_name} size="size-10" />
                               </div>
                            </Link>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="sm:hidden text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </header>

                     {isMenuOpen && (
                        <nav className="sm:hidden bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-xl p-4 -mt-4 border border-slate-200/50 dark:border-slate-800/50">
                            <ul className="flex flex-col gap-2">
                                <li><Link to="/student-dashboard" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                                <li><Link to="/journal" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Journal</Link></li>
                                <li><Link to="/resources" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>Resources</Link></li>
                            </ul>
                        </nav>
                    )}

                    <main className="flex flex-col gap-8 mt-4 items-center">
                        <div className="w-full max-w-2xl">
                             <div className="text-center mb-8 flex flex-col items-center">
                                 <UserAvatar avatarUrl={user.user_metadata.avatar_url} name={user.user_metadata.full_name} size="size-24" extraClasses="mb-4" />
                                <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.03em]">Profile Settings</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account information.</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
                                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            disabled
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="fullName">Full Name</label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                                            required
                                        />
                                    </div>
                                    
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                                    
                                    <div className="flex justify-between items-center mt-4">
                                         <button type="submit" disabled={loading} className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity disabled:opacity-50">
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button type="button" onClick={handleSignOut} disabled={loading} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                            Sign Out
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;