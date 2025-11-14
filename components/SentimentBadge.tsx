
import React from 'react';
import { ConcernLevel } from '../types';

interface SentimentBadgeProps {
  level: ConcernLevel;
  score: number;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ level, score }) => {
  const getBadgeClasses = () => {
    switch (level) {
      case ConcernLevel.High:
        return 'bg-high-concern-bg text-high-concern-text';
      case ConcernLevel.Moderate:
        return 'bg-moderate-concern-bg text-moderate-concern-text';
      case ConcernLevel.Low:
        return 'bg-low-concern-bg text-low-concern-text';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-full h-8 px-3 text-xs font-semibold ${getBadgeClasses()}`}>
      <span>{level} ({score.toFixed(2)})</span>
    </div>
  );
};

export default SentimentBadge;