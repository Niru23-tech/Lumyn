
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export enum ConcernLevel {
  High = 'High Concern',
  Moderate = 'Moderate Concern',
  Low = 'Low Concern',
}

export interface Student {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface JournalEntry {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface Resource {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

export interface Counselor {
    id:string;
    name: string;
    title: string; // e.g., "LPC, PhD"
    imageUrl: string;
    avatar_url?: string;
}

export interface MoodLog {
    id: number;
    user_id: string;
    mood: number;
    created_at: string;
}

export interface Appointment {
  id: number;
  student_id: string;
  counselor_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'declined';
  created_at: string;
  // This is for fetching student data with the appointment
  profiles?: {
      full_name: string;
      avatar_url?: string | null;
  }
}