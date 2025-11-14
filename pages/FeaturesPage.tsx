import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, imageUrl }: { icon: string; title: string; description: string; imageUrl: string }) => (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80 even:md:flex-row-reverse">
        <div className="md:w-1/2">
            <div className="text-primary mb-4">
                <span className="material-symbols-outlined !text-4xl">{icon}</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mb-4">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">{description}</p>
        </div>
        <div className="md:w-1/2 w-full">
            <div className="aspect-video rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
        </div>
    </div>
);

const FeaturesPage: React.FC = () => {
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
                <Link to="/features" className="text-primary dark:text-primary text-sm font-medium leading-normal">Features</Link>
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
                <div className="flex flex-col gap-10 items-center text-center mb-16">
                    <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl">Features Designed for You</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-3xl">
                        Lumyn provides a suite of tools to support your mental wellness journey. Explore how our features can provide immediate, confidential, and personalized support whenever you need it.
                    </p>
                </div>

                <div className="flex flex-col gap-12">
                    <FeatureCard
                        icon="chat"
                        title="24/7 Private Chat Log"
                        description="Our core feature is a private and secure chat log, available around the clock. It offers a safe space to write down your thoughts, process feelings, and keep a record of your reflections. Whether it's late-night anxiety or pre-exam stress, you have a place to express yourself without judgment."
                        imageUrl="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                    />
                     <FeatureCard
                        icon="auto_stories"
                        title="Guided Journals & Mood Tracking"
                        description="Understand your emotional patterns with our integrated mood tracker and guided journaling. Prompts and exercises help you reflect on your feelings, identify triggers, and celebrate progress. Your dashboard visualizes your mood over time, providing valuable insights for you and, if you choose, your counselor."
                        imageUrl="https://images.unsplash.com/photo-1491841550275-5b462bf47759?q=80&w=2070&auto=format&fit=crop"
                    />
                    <FeatureCard
                        icon="groups"
                        title="Connect with Professionals"
                        description="For moments when you need more, Lumyn provides a seamless connection to certified counselors. The platform helps counselors monitor student well-being through an anonymized dashboard, allowing them to intervene when necessary. This creates a safety net, ensuring no student has to face their struggles alone."
                        imageUrl="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop"
                    />
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

export default FeaturesPage;