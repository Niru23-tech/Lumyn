
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const StudentSignIn: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            // Store the intended role before redirecting to Google
            localStorage.setItem('lumyn_role', 'student');
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
             setError(err.error_description || err.message);
             setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center justify-center gap-4 text-center mb-8">
                    <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined !text-4xl">psychology</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-[-0.015em]">Lumyn</h2>
                    </Link>
                    <p className="text-slate-600 dark:text-slate-400">
                        Welcome, student. We're here for you.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
                    <div className="flex flex-col gap-6">
                         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button 
                            onClick={handleGoogleSignIn}
                            disabled={loading} 
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG52rb3T1B_P2aL-lA2_I41AZX-2P_2a5k6gJ_9iY22I63p6ZDXs8o2L_jsQdl_TFX6eS_Q-PqjH1wYJpG_oA=s32" alt="Google icon" className="w-6 h-6 mr-3" />
                           {loading ? 'Redirecting...' : 'Sign In with Google'}
                        </button>
                    </div>
                     <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        By signing in, you agree to our Terms of Service.
                    </p>
                </div>
                 <div className="text-center mt-6">
                     <Link to="/counselor-signin" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                        Are you a counselor? Sign in here.
                     </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentSignIn;