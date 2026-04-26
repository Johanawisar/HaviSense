"use client";
// hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import { authLogin, authLogout } from "@/lib/api";
import type { AuthUser } from "@/types";

export function useAuth() {
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("havi_token");
    const storedUser  = localStorage.getItem("havi_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authLogin(email, password);
    const u: AuthUser = {
      user_id: data.user_id,
      nombre:  data.nombre,
      rol:     data.rol,
      email,
    };
    localStorage.setItem("havi_token", data.access_token);
    localStorage.setItem("havi_user",  JSON.stringify(u));
    setToken(data.access_token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await authLogout(); } catch {}
    localStorage.removeItem("havi_token");
    localStorage.removeItem("havi_user");
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, loading, login, logout, isAuthenticated: !!token };
}
