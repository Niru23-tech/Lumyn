import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            {/* TopNavBar */}
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
            {/* HeroSection */}
            <main className="flex-1">
              <div className="py-16 sm:py-20 lg:py-24 @container">
                <div className="flex flex-col gap-10 lg:gap-16 px-4 py-10 @[864px]:flex-row-reverse">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full bg-center bg-no-repeat aspect-square bg-contain rounded-xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-QPlHxgqTbwS-XSEBbv2Bc11moHKAuYNVEXXRch7fPS2nFNEnUSxJvWF-At68LZSU0X2RgKgRKkYjyLVaSJxlFUG1TWo8EVUkjO2r_F1iMYxV2qjtClLJymSsjJIpCu5rYBa1UWw0i675r6Z7Wf49q79rZ1r8uXww287GNAYkWT-j9evL5cfEgOD8VMedwKs97caw4dw1d9wfnlMy9sm1qF2L_ef8Spj3htCHKYr4o-DOXxA-iNHdzZB3XbWaBEs12UmfS102xkA")' }}></div>
                  </div>
                  <div className="flex flex-1 flex-col gap-6 @[864px]:justify-center">
                    <div className="flex flex-col gap-4 text-left">
                      <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                        Your Companion for Emotional Support
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal @[480px]:text-lg">
                        Chat, reflect, and connect — anytime you need to talk. Lumyn offers a safe space for students to explore their feelings and get the support they deserve.
                      </p>
                    </div>
                    <div className="flex-wrap gap-3 flex">
                      <Link to="/chat" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Start Writing</span>
                      </Link>
                      <button onClick={scrollToFeatures} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-slate-200/50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Learn More</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* FeatureSection */}
              <div ref={featuresRef} className="flex flex-col gap-10 px-4 py-10 sm:py-16 @container scroll-mt-20">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h2 className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight @[480px]:text-4xl @[480px]:font-black max-w-xl">
                    How Lumyn Can Help You
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-2xl">
                    Explore our features designed to provide you with immediate, confidential, and personalized support on your mental wellness journey.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 p-0">
                  <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">chat</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">24/7 Chat Log</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">A secure space is always available to log your thoughts and feelings, day or night.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">auto_stories</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Guided Journals</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Reflect on your thoughts and feelings with structured journaling exercises.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">groups</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Connect with Professionals</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Easily find and schedule sessions with certified counselors.</p>
                    </div>
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

export default LandingPage;