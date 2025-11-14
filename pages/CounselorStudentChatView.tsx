import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Message, Student } from '../types';
import ChatMessage from '../components/ChatMessage';
import { supabase } from '../services/supabaseClient';
import { summarizeChatHistory } from '../services/geminiService';
import UserAvatar from '../components/UserAvatar';

const CounselorStudentChatView: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [counselor, setCounselor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // State for AI Summary
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setError("No student ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      setCounselor(user);

      // Fetch student details
      const { data: studentData, error: studentError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', studentId)
        .single();

      if (studentError || !studentData) {
        setError("Could not find student data. They may not exist or you may not have permission to view them.");
        console.error(studentError);
        setLoading(false);
        return;
      }
      setStudent({
          id: studentData.id,
          name: studentData.full_name || 'Student',
          avatar_url: studentData.avatar_url
      });

      // Fetch student's messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', studentId)
        .order('timestamp', { ascending: true });

      if (messagesError) {
        setError("Could not load chat history. You may not have the required permissions.");
        console.error(messagesError);
      } else {
        const formattedMessages = messagesData.map(m => ({
          id: m.id.toString(),
          text: m.text,
          sender: m.sender,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(formattedMessages);
      }
      setLoading(false);
    };

    fetchData();
  }, [studentId]);

  const handleGetSummary = async () => {
    if (messages.length === 0) return;
    setIsSummarizing(true);
    setSummary(null);
    try {
        const result = await summarizeChatHistory(messages);
        setSummary(result);
    } catch (error) {
        console.error(error);
        setSummary("Failed to generate summary.");
    } finally {
        setIsSummarizing(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-3 dark:border-slate-800 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {student && <UserAvatar avatarUrl={student.avatar_url} name={student.name} size="size-10" />}
            <div>
              <h2 className="text-slate-900 text-base font-bold leading-tight dark:text-white">
                {loading ? 'Loading...' : student?.name || 'Student Chat'}
              </h2>
              <p className="text-slate-500 text-sm font-normal leading-normal dark:text-slate-400">Viewing chat history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/counselor-dashboard" className="flex h-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Dashboard</span>
            </Link>
             {counselor && <UserAvatar avatarUrl={counselor?.user_metadata?.avatar_url} name={counselor?.user_metadata?.full_name} size="size-10" />}
          </div>
        </header>
        
        {/* Summary Section */}
        <div className="p-8 pb-0">
            <div className="mx-auto max-w-3xl">
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex justify-between items-center gap-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI-Generated Summary</h3>
                        <button
                            onClick={handleGetSummary}
                            disabled={isSummarizing || loading || messages.length === 0}
                            className="flex items-center gap-2 rounded-lg bg-c-primary/10 dark:bg-c-primary/20 px-4 py-2 text-sm font-semibold text-c-primary dark:text-indigo-300 hover:bg-c-primary/20 dark:hover:bg-c-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-base">auto_awesome</span>
                            <span>{isSummarizing ? 'Analyzing...' : (summary ? 'Regenerate' : 'Generate Summary')}</span>
                        </button>
                    </div>
                    {isSummarizing && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Lumyn is analyzing the conversation. This may take a moment...</p>}
                    {summary && (
                        <div className="mt-4 space-y-2 text-slate-700 dark:text-slate-300">
                            {summary.split('*').filter(s => s.trim()).map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="mr-2 mt-1 text-c-primary">•</span>
                                    <p className="flex-1 text-sm">{item.trim()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>


        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {loading ? (
              <p className="text-center text-slate-500">Loading chat history...</p>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : messages.length === 0 ? (
                <p className="text-center text-slate-500">This student has no chat history yet.</p>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} user={null} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CounselorStudentChatView;
