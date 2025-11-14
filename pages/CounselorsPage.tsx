
import React from 'react';
import { Link } from 'react-router-dom';

const CounselorProfile = ({ name, title, imageUrl }: { name: string; title: string; imageUrl: string }) => (
    <div className="flex flex-col items-center text-center gap-4">
        <div className="size-32 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
        <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">{name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
        </div>
    </div>
);


const CounselorsPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-10 py-3">
              <Link to="/" className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
                <div className="size-6 text-primary">
                    <span className="material-symbols-outlined !text-3xl">psychology</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Lumyn</h2>
              </Link>
              <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
                <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">Home</Link>
                <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">About</Link>
                <Link to="/features" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">Features</Link>
                <Link to="/counselors" className="text-primary dark:text-primary text-sm font-medium leading-normal">Counselors</Link>
              </nav>
              <div className="flex items-center gap-2">
                <Link to="/student-signin" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[-0.015em]">
                  <span className="truncate">Student Login</span>
                </Link>
                <Link to="/counselor-signin" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[-0.015em]">
                  <span className="truncate">Counselor Login</span>
                </Link>
              </div>
            </header>

            <main className="flex-1 py-16 sm:py-20 lg:py-24 px-4">
                <div className="flex flex-col gap-10 items-center text-center mb-16">
                    <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl">Partner with Lumyn</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-3xl">
                        Join our network of compassionate professionals dedicated to student mental wellness. Lumyn provides you with tools to effectively monitor and support students, helping you make a bigger impact.
                    </p>
                    <Link to="/counselor-signin" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-c-primary text-white text-base font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Join as a Counselor</span>
                    </Link>
                </div>
                
                <div className="py-16">
                    <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight text-center mb-12">Meet Our Counselors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <CounselorProfile name="Dr. Emily Carter" title="PhD, LPC" imageUrl="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop" />
                        <CounselorProfile name="Michael Chen" title="LCSW" imageUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop" />
                        <CounselorProfile name="Dr. Aisha Khan" title="PsyD" imageUrl="https://images.unsplash.com/photo-1488426862026-39b533072b2c?q=80&w=1974&auto=format&fit=crop" />
                        <CounselorProfile name="David Rodriguez" title="LMFT" imageUrl="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1975&auto=format&fit=crop" />
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-8 px-5 py-10 text-center border-t border-slate-200 dark:border-slate-800 @container">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 @[480px]:flex-row @[480px]:justify-center">
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-normal leading-normal">Privacy Policy</Link>
                <Link to="/resources" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-normal leading-normal">Mental Health Resources</Link>
                <Link to="/counselors" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-normal leading-normal">Contact Support</Link>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-normal italic">“You are never alone in this journey.”</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">© 2024 Lumyn. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorsPage;
