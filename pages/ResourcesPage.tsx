
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Resource } from '../types';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';
import ResourceModal from '../components/ResourceModal';

const mockResources: Resource[] = [
    {
        title: 'Managing Exam Stress: A Student’s Guide',
        description: 'Learn effective strategies to cope with the pressure of exams, from study techniques to mindfulness exercises.',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b773f444d83?q=80&w=2070&auto=format&fit=crop',
        link: '#!',
        fullContent: 'Exam periods can be one of the most stressful times for a student. The pressure to perform well can lead to anxiety and burnout. This guide offers a comprehensive approach to managing exam stress. We cover proven study techniques like the Pomodoro method to improve focus, time management strategies to create a balanced schedule, and mindfulness exercises such as deep breathing and meditation to calm your nerves. By implementing these strategies, you can approach your exams with confidence and maintain your well-being.'
    },
    {
        title: 'The Importance of Sleep for Mental Health',
        description: 'Discover how a consistent sleep schedule can dramatically improve your mood, focus, and overall well-being.',
        imageUrl: 'https://images.unsplash.com/photo-1595349392359-2598730623b4?q=80&w=2070&auto=format&fit=crop',
        link: '#!',
        fullContent: 'Sleep is not just a passive activity; it is a critical function for our mental and physical health. During sleep, our brains consolidate memories, process emotions, and clear out toxins. Chronic sleep deprivation can severely impact cognitive function, leading to difficulty concentrating, irritability, and an increased risk of anxiety and depression. This article explores the science behind sleep and provides actionable tips for improving your sleep hygiene, such as creating a relaxing bedtime routine, optimizing your sleep environment, and understanding the impact of diet and exercise on your sleep quality.'
    },
    {
        title: 'Building Resilience in Your College Years',
        description: 'Navigate the ups and downs of student life by developing psychological resilience and a growth mindset.',
        imageUrl: 'https://images.unsplash.com/photo-1524678606370-a47625cb810c?q=80&w=2070&auto=format&fit=crop',
        link: '#!',
        fullContent: 'College is a time of immense growth and change, but it can also bring significant challenges. Resilience is the ability to bounce back from adversity. This article provides a framework for building psychological resilience. We discuss the importance of cultivating a growth mindset—seeing challenges as opportunities for learning rather than insurmountable obstacles. We also cover practical skills such as problem-solving, emotional regulation, building a strong support network, and practicing self-compassion. By strengthening your resilience, you can better navigate the complexities of student life.'
    },
    {
        title: '5-Minute Mindfulness Exercises for Busy Students',
        description: 'Find calm and focus anywhere, anytime with these quick and easy mindfulness practices.',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-4e05217cc1ad?q=80&w=2070&auto=format&fit=crop',
        link: '#!',
        fullContent: 'In the midst of a hectic student schedule, finding time for self-care can seem impossible. However, even a few minutes of mindfulness can make a significant difference. This guide offers five simple mindfulness exercises, each designed to be completed in five minutes or less. From a mindful breathing exercise you can do between classes to a body scan meditation before sleep, these practices can help reduce stress, improve focus, and bring a sense of calm to your busy day. No special equipment is needed—just a willingness to pause and connect with the present moment.'
    },
    {
        title: 'How to Support a Friend Who Is Struggling',
        description: 'Learn how to be an effective and compassionate ally for friends facing mental health challenges.',
        imageUrl: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=1974&auto=format&fit=crop',
        link: '#!',
        fullContent: 'Seeing a friend struggle with their mental health can be difficult, and it\'s often hard to know how to help. This article provides guidance on how to be a supportive and compassionate friend. We cover key communication skills like active listening and validating their feelings without judgment. We also discuss the importance of setting boundaries to protect your own well-being, how to gently encourage your friend to seek professional help, and what resources are available. Being a good friend doesn\'t mean being a therapist, but your support can make a world of difference.'
    },
    {
        title: 'Nutrition and Mental Wellness: The Brain-Food Connection',
        description: 'Explore the link between what you eat and how you feel, with tips for a brain-healthy diet.',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop',
        link: '#!',
        fullContent: 'The connection between our gut and our brain is a rapidly growing area of research, and the evidence is clear: what we eat significantly affects our mental health. This article delves into the "brain-food connection," exploring how certain nutrients can support cognitive function and emotional regulation. We discuss the role of omega-3 fatty acids, vitamins, minerals, and probiotics in brain health. You\'ll find practical tips for incorporating brain-healthy foods into your diet, such as leafy greens, fatty fish, nuts, and fermented foods, to help you feel your best both physically and mentally.'
    },
];

const ResourceCard: React.FC<{ resource: Resource, onReadMore: (resource: Resource) => void }> = ({ resource, onReadMore }) => (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-soft flex flex-col">
        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${resource.imageUrl})` }}></div>
        <div className="p-6 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{resource.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">{resource.description}</p>
            <button onClick={() => onReadMore(resource)} className="text-primary dark:text-blue-400 font-semibold mt-4 text-left hover:underline">Read More →</button>
        </div>
    </div>
);


const ResourcesPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    return (
        <>
            <ResourceModal 
                resource={selectedResource} 
                onClose={() => setSelectedResource(null)} 
            />
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
                                <Link to="/resources" className="text-slate-900 dark:text-white text-sm font-medium">Resources</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <Link to="/student-profile">
                                        <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
                                    </Link>
                                ) : (
                                    <Link to="/student-signin" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </header>
                        <main className="flex flex-col gap-8 mt-4">
                             <div className="text-center">
                                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Wellness Resources</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">A curated collection of articles and guides to help you navigate your mental wellness journey.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {mockResources.map(res => <ResourceCard key={res.title} resource={res} onReadMore={setSelectedResource} />)}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResourcesPage;