
import React from 'react';
import { Resource } from '../types';

interface ResourceModalProps {
    resource: Resource | null;
    onClose: () => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
    if (!resource) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4" 
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-3xl m-4 max-h-[90vh] flex flex-col transform transition-all"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{resource.title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="overflow-y-auto">
                    <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url(${resource.imageUrl})` }}></div>
                    <div className="p-6 md:p-8">
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {resource.fullContent}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceModal;
