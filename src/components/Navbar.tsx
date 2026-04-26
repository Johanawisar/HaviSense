"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, MessageCircle, User, LogOut } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat",      label: "Chat Havi",  icon: MessageCircle   },
  { href: "/perfil",    label: "Perfil",     icon: User            },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-hey-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hey-orange flex items-center justify-center">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">HaviSense</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                pathname === href
                  ? "bg-hey-orange text-white"
                  : "text-hey-muted hover:text-white hover:bg-hey-border"
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-hey-muted hidden sm:block font-mono">
            {user?.user_id}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-hey-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:block">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
