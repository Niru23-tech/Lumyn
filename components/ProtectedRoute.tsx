
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: 'student' | 'counselor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/student-signin', requiredRole }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const checkSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setRoleChecked(true); // Mark as checked even if no session
    };

    checkSessionAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRoleChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Display a loading indicator while the session and role are being checked
  if (session === undefined || !roleChecked) {
    return <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark"><p>Loading...</p></div>;
  }

  // If there is no session, redirect to the specified sign-in page
  if (!session || !user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If a role is required, check it.
  if (requiredRole) {
    const userRole = user.user_metadata.role;
    if (userRole !== requiredRole) {
      // If role doesn't match, redirect them to their own dashboard or a safe default
      const defaultPath = userRole === 'counselor' ? '/counselor-dashboard' : '/student-dashboard';
      return <Navigate to={defaultPath} replace />;
    }
  }

  // If session and role checks pass, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;