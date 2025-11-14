
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Message } from '../types';
import ChatMessage from '../components/ChatMessage';
import { getChatResponse } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const initialAiMessage: Message = {
    id: '1',
    text: "Hello! I'm here to listen. How are you feeling today?",
    sender: 'ai',
    timestamp: new Date(),
  };

  useEffect(() => {
    const fetchSessionAndMessages = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: messagesData, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          setMessages([initialAiMessage]);
        } else {
          const formattedMessages = messagesData.map(m => ({
            id: m.id.toString(),
            text: m.text,
            sender: m.sender,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(formattedMessages.length > 0 ? formattedMessages : [initialAiMessage]);
        }
      } else {
        setMessages([initialAiMessage]);
      }
      setIsLoading(false);
    };
    fetchSessionAndMessages();
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([initialAiMessage]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Capture the current input before clearing the state.
    const messageToSend = trimmedInput;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Capture the history for the API call BEFORE updating the UI state.
    const historyForApi = [...messages];

    // Update the UI immediately with the user's message and clear the input.
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Save the user's message to the database.
    if (user) {
        await supabase.from('messages').insert({
            text: userMessage.text,
            sender: 'user',
            user_id: user.id,
            timestamp: userMessage.timestamp.toISOString(),
        });
    }

    try {
      // Call the Gemini API with the correct history and the new message.
      const aiResponseText = await getChatResponse(historyForApi, messageToSend);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Add the AI's response to the UI.
      setMessages((prev) => [...prev, aiMessage]);
      
      // Save the AI's response to the database.
      if (user) {
          await supabase.from('messages').insert({
              text: aiMessage.text,
              sender: 'ai',
              user_id: user.id,
              timestamp: aiMessage.timestamp.toISOString(),
          });
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, something went wrong. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="flex h-full w-full">
        {/* Side Navigation */}
        <aside className="hidden md:flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-background-dark/50">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 px-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-xl">spark</span>
              </div>
              <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">Lumyn</h1>
            </Link>
            <div className="flex flex-col gap-2">
              <button onClick={handleNewChat} className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                <p className="text-sm font-medium leading-normal">New Chat</p>
              </button>
              <Link to="/student-dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-xl">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link to="/journal" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-xl">auto_stories</span>
                <p className="text-sm font-medium leading-normal">Journal</p>
              </Link>
              <Link to="/resources" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-xl">school</span>
                <p className="text-sm font-medium leading-normal">Resources</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Link to="/resources" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-xl">help</span>
              <p className="text-sm font-medium leading-normal">Help Center</p>
            </Link>
            <Link to="/student-profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-xl">settings</span>
              <p className="text-sm font-medium leading-normal">Profile</p>
            </Link>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col">
          {/* Chat Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-3 dark:border-slate-800 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_4j0huPzSUzIdJDWzHVdfY8h_lwl410lZp2y_1UmKb2-orxeGUAwlx69tSDTwylltYaxmE-SV5137DDWYdiyfHPm4A8b-jbftic0MOyiYeTM5wGwqviUBiQZyF--1G2mV91SYvCSLCyZGr1K8-iZd5Mc80s7w31lA7ocR1VjQXC7SnMrvzENs51D7Sm7ELCIpR2pL09itFKoQr8lXoh9Y_m18L4Q3Pk4JGa32VDgsfNwZY3fWbialGrazr1fSPu-OiozRg-4hDoY")'}}></div>
                <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500 dark:border-background-dark"></div>
              </div>
              <div>
                <h2 className="text-slate-900 text-base font-bold leading-tight dark:text-white">Lumyn AI</h2>
                <p className="text-slate-500 text-sm font-normal leading-normal dark:text-slate-400">Here to listen</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name} size="size-10" />
            </div>
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} user={user} />
              ))}
              {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                <div className="flex items-end gap-3">
                   <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDD7RcXK5C8RLUsb2D8JXpyVBmg-3uYauQb6wJSO8QYCZNSfVlu4V2GDCbXyqlSc2DxGiFLcQcLTA7c-lFvl0bUr_ibaW9wbOPIn-rcJURNec0Hg-8kS8XkxXZBVYtM8p4OjAmnm3jzZ8YSL-9p_7kri7z0MXnMyHiuaKQkUPJWIMAiVl2eD7C65lvvIH1zqd3MIhH-u-ToL4hVJTMUU-ipLCbOnwY4u3GquCKAJz32ImIXbW9-j0G5vvtC21Q9X0RvXGjMgB3Xgt8")' }}></div>
                  <div className="flex flex-1 flex-col items-start gap-1.5">
                    <p className="text-slate-500 text-[13px] font-medium leading-normal dark:text-slate-400">Lumyn AI</p>
                    <div className="max-w-md rounded-xl rounded-bl-none bg-slate-100 px-4 py-3 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      <p className="text-base font-normal leading-relaxed flex items-center gap-2">
                        <span className="animate-pulse">...</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Composer */}
          <footer className="shrink-0 border-t border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-background-dark/80">
            <form onSubmit={handleSend} className="mx-auto max-w-3xl">
              <div className="relative flex items-center gap-3">
                <div className="flex w-full items-stretch rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <input
                    className="form-input w-full flex-1 resize-none overflow-hidden border-none bg-transparent px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-0 focus:ring-0 dark:text-slate-200"
                    placeholder="Tell me what's on your mind..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button type="submit" disabled={isLoading || !input.trim()} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary text-white disabled:opacity-50">
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </form>
          </footer>
        </main>

        {/* Mood Side Panel */}
        <aside className="hidden w-72 flex-col gap-4 border-l border-slate-200 bg-white/50 p-6 dark:border-slate-800 dark:bg-background-dark/50 lg:flex">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Mood</h3>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex h-16 w-4 items-center overflow-hidden rounded-full">
              <div className="absolute h-full w-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-3/5 w-full self-end rounded-full bg-blue-300"></div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-5xl">😐</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Feeling Neutral</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mood last updated: 10m ago</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Suggested Resources</p>
            <Link to="/resources" className="rounded-lg p-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">5-Minute Breathing Exercise</Link>
            <Link to="/resources" className="rounded-lg p-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">Journaling for Stress Relief</Link>
            <Link to="/resources" className="rounded-lg p-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">Understanding Overwhelm</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChatPage;
