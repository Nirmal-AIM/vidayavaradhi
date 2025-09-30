"use client";

import { useState, useEffect } from "react";

export interface UserSession {
  userId: string;
  email: string;
  role: "learner" | "trainer" | "policymaker";
  name: string;
  isAuthenticated: boolean;
}

export function useAuthSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setSession({
              userId: data.user.id,
              email: data.user.email,
              role: data.user.role,
              name: data.user.name,
              isAuthenticated: true,
            });
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, isLoading };
}