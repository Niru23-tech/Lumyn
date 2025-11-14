import React from 'react';
import type { User } from '@supabase/supabase-js';
import { Message } from '../types';
import UserAvatar from './UserAvatar';

interface ChatMessageProps {
  message: Message;
  user: User | null;
}

const AIMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-end gap-3">
    <div
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
      data-alt="AI avatar with a calming abstract pattern"
      style={{
        backgroundImage:
          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSjWuE2zvdtJW4WaYHs2F_o-zgPzIE2cF0YylVbqMCEoAGVpwLs5cSLv8yVd1wQmsrnlzaXJeZISAGyiQupdO5x8CbfAD0xH5hVQ7vzfhsbVHY9d8pgI9a5GKKGg6C_QfVYN_OAzYxuhcnFNlgVI1ZuOn8xi5kJDwiR4gO7gwFmMwP4b9BsPe8N0sx6stuwmhNkWBQxQ2iUe8KWv2Opzmao1rsUAtrLRGKnRaCFO-lDbyQzElL1HQs2YzLPjegra1724m2t5mFUxc")',
      }}
    ></div>
    <div className="flex flex-1 flex-col items-start gap-1.5">
      <p className="text-slate-500 text-[13px] font-medium leading-normal dark:text-slate-400">Lumyn AI</p>
      <div className="max-w-md rounded-xl rounded-bl-none bg-slate-100 px-4 py-3 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
        <p className="text-base font-normal leading-relaxed">{text}</p>
      </div>
    </div>
  </div>
);

const UserMessage: React.FC<{ text: string; user: User | null }> = ({ text, user }) => (
  <div className="flex items-end justify-end gap-3">
    <div className="flex flex-1 flex-col items-end gap-1.5">
      <p className="text-slate-500 text-[13px] font-medium leading-normal dark:text-slate-400">You</p>
      <div className="max-w-md rounded-xl rounded-br-none bg-primary px-4 py-3 text-white">
        <p className="text-base font-normal leading-relaxed">{text}</p>
      </div>
    </div>
    <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user }) => {
  if (message.sender === 'ai') {
    return <AIMessage text={message.text} />;
  }
  return <UserMessage text={message.text} user={user} />;
};

export default ChatMessage;
