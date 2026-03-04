"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getStoredUser } from "@/lib/auth/fakeUser";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  return { user, loading, isLoggedIn: !!user };
}
