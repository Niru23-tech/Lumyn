
import React from 'react';

interface UserAvatarProps {
    avatarUrl?: string | null;
    name?: string | null;
    size?: string;
    extraClasses?: string;
}

const getInitials = (name: string = ''): string => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
};

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, name, size = 'size-10', extraClasses = '' }) => {
    if (avatarUrl) {
        return (
            <div
                className={`bg-center bg-no-repeat bg-cover rounded-full ${size} ${extraClasses}`}
                style={{ backgroundImage: `url(${avatarUrl})` }}
                role="img"
                aria-label={name || 'User avatar'}
            ></div>
        );
    }

    // Fallback to initials
    const initials = getInitials(name || '');
    const colors = [
        'bg-blue-200 text-blue-800', 'bg-purple-200 text-purple-800',
        'bg-green-200 text-green-800', 'bg-orange-200 text-orange-800',
        'bg-pink-200 text-pink-800', 'bg-indigo-200 text-indigo-800'
    ];
    // Simple hash to get a consistent color for a name
    const colorIndex = (name || '').length % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <div
            className={`flex items-center justify-center rounded-full font-bold ${size} ${colorClass} ${extraClasses}`}
            aria-label={name || 'User avatar'}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;