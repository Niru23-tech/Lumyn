
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
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
                <Link to="/about" className="text-primary dark:text-primary text-sm font-medium leading-normal">About</Link>
                <Link to="/features" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">Features</Link>
                <Link to="/counselors" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">Counselors</Link>
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
              <div className="flex flex-col gap-10 items-center text-center">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl">Our Mission</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-3xl">
                  At Lumyn, we believe that every student deserves accessible and immediate emotional support. The pressures of academic life, social challenges, and personal growth can be overwhelming. Our mission is to provide a safe, confidential, and non-judgmental space where students can freely express themselves, gain perspective, and find the strength to navigate their journey.
                </p>
                <div className="w-full max-w-4xl bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554189097-90d3a584e165?q=80&w=1935&auto=format&fit=crop")' }}></div>
                <div className="grid md:grid-cols-2 gap-8 text-left pt-12">
                    <div>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.03em] mb-4">Our Vision</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
                            We envision a world where mental wellness is prioritized, and seeking help is seen as a sign of strength. By leveraging the power of AI, we aim to break down barriers to mental healthcare, making support more immediate, accessible, and stigma-free for students everywhere.
                        </p>
                    </div>
                     <div>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-[-0.03em] mb-4">Our Technology</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
                            Lumyn is powered by Google's state-of-the-art Gemini models. This allows our AI companion to engage in nuanced, empathetic, and helpful conversations. We are committed to responsible AI development, ensuring user privacy and data security are at the forefront of everything we do.
                        </p>
                    </div>
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

export default AboutPage;