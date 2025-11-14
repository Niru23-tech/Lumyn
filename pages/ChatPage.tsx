
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Message } from '../types';
import ChatMessage from '../components/ChatMessage';
import { supabase } from '../services/supabaseClient';
import UserAvatar from '../components/UserAvatar';
import { GoogleGenAI, Chat, Content } from '@google/genai';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessionAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: messagesData, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: true });

        let formattedMessages: Message[] = [];
        if (error) {
          console.error("Error fetching messages:", error);
        } else if (messagesData) {
            if (messagesData.length === 0) {
                 // Add a default welcome message for new chats
                formattedMessages.push({
                    id: 'initial-welcome',
                    text: "Hello! I'm Lumyn, your AI companion. How are you feeling today? I'm here to listen.",
                    sender: 'ai',
                    timestamp: new Date(),
                });
            } else {
                 formattedMessages = messagesData.map(m => ({
                    id: m.id.toString(),
                    text: m.text,
                    sender: m.sender as 'user' | 'ai',
                    timestamp: new Date(m.timestamp),
                }));
            }
          setMessages(formattedMessages);
        }
        
        // Initialize Gemini Chat
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const history: Content[] = formattedMessages
            .filter(msg => msg.id !== 'initial-welcome') // Don't include the UI-only welcome message in history
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: 'You are Lumyn, a friendly and empathetic AI companion for students. Provide supportive and understanding responses. Do not give medical advice. Keep your responses concise and helpful, like a supportive friend. Use emojis occasionally to convey warmth and empathy.',
            },
        });

      } else {
        setMessages([]);
      }
    };
    fetchSessionAndMessages();
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = async () => {
     if (!user) {
        setMessages([]);
        return;
     }
      const welcomeMessage = {
          id: 'initial-welcome',
          text: "Hello! I'm Lumyn, your AI companion. How are you feeling today? I'm here to listen.",
          sender: 'ai',
          timestamp: new Date(),
      };
      // Optimistically clear UI and add welcome message, then delete from DB
      setMessages([welcomeMessage]);
      await supabase.from('messages').delete().eq('user_id', user.id);
      
      // Re-initialize chat
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [],
        config: {
            systemInstruction: 'You are Lumyn, a friendly and empathetic AI companion for students. Provide supportive and understanding responses. Do not give medical advice. Keep your responses concise and helpful, like a supportive friend. Use emojis occasionally to convey warmth and empathy.',
        },
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Save user message and get AI response
    if (user && chatRef.current) {
        await supabase.from('messages').insert({
            text: userMessage.text,
            sender: 'user',
            user_id: user.id,
            timestamp: userMessage.timestamp.toISOString(),
        });

        try {
            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            const aiText = response.text;
            
            const aiMessage: Message = {
                id: Date.now().toString() + '-ai',
                text: aiText,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);

            await supabase.from('messages').insert({
                text: aiMessage.text,
                sender: 'ai',
                user_id: user.id,
                timestamp: aiMessage.timestamp.toISOString(),
            });

        } catch (error) {
            console.error("Error from Gemini API:", error);
            const errorMessage: Message = {
                id: Date.now().toString() + '-error',
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    } else {
        setIsLoading(false);
    }
  };

  const TypingIndicator = () => (
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
          <div className="flex items-center justify-center gap-1.5 h-6">
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );


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
                 <div className="bg-primary/20 text-primary flex items-center justify-center aspect-square rounded-full size-10">
                    <span className="material-symbols-outlined text-2xl">spark</span>
                 </div>
              </div>
              <div>
                <h2 className="text-slate-900 text-base font-bold leading-tight dark:text-white">AI Companion</h2>
                <p className="text-slate-500 text-sm font-normal leading-normal dark:text-slate-400">A friendly space to talk</p>
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
              {isLoading && <TypingIndicator />}
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
                  />
                </div>
                <button type="submit" disabled={!input.trim() || isLoading} className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary text-white disabled:opacity-50">
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