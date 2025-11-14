
import React, { useState } from 'react';

interface MoodLoggerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (mood: number) => void;
}

const moodOptions = [
    { level: 1, emoji: '😔', label: 'Very Bad' },
    { level: 2, emoji: '😕', label: 'Bad' },
    { level: 3, emoji: '😐', label: 'Neutral' },
    { level: 4, emoji: '🙂', label: 'Good' },
    { level: 5, emoji: '😄', label: 'Very Good' },
];

const MoodLoggerModal: React.FC<MoodLoggerModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedMood, setSelectedMood] = useState<number | null>(3);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (selectedMood === null) return;
        setLoading(true);
        await onSave(selectedMood);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md m-4 p-8 flex flex-col gap-6 transform transition-all">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How are you feeling?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Select a mood that best describes how you feel right now.</p>
                </div>
                
                <div className="flex justify-around items-center py-4">
                    {moodOptions.map(({ level, emoji, label }) => (
                        <button 
                            key={level} 
                            onClick={() => setSelectedMood(level)}
                            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all transform hover:scale-110 ${selectedMood === level ? 'bg-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            aria-label={`Select mood: ${label}`}
                        >
                            <span className={`text-5xl transition-transform ${selectedMood === level ? 'scale-110' : ''}`}>{emoji}</span>
                            <span className={`text-xs font-semibold ${selectedMood === level ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 mt-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base font-bold leading-normal hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={selectedMood === null || loading}
                        className="flex-1 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-base font-bold leading-normal hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Mood'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoodLoggerModal;
