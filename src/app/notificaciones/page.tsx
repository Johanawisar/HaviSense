"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postTrigger, getPerfil } from "@/lib/api";
import { Bell, MessageCircle, ArrowLeft, ShieldAlert, TrendingUp, Zap, Music, Star } from "lucide-react";
import clsx from "clsx";

const NOTIF_TRIGGERS = [
  { id: "pal_norte",               label: "Pal Norte 2026",       icon: Music,       color: "#F5A623", bg: "#FEF3E2" },
  { id: "nomina",                  label: "Nómina recibida",       icon: Star,        color: "#1D9E75", bg: "#E1F5EE" },
  { id: "cross_sell_seguro",       label: "Oferta de seguro",      icon: ShieldAlert, color: "#534AB7", bg: "#EEEDFE" },
  { id: "cross_sell_inversion",    label: "Oferta de inversión",   icon: TrendingUp,  color: "#F5A623", bg: "#FEF3E2" },
  { id: "cashback_entretenimiento",label: "Cashback en eventos",   icon: Zap,         color: "#1D9E75", bg: "#E1F5EE" },
  { id: "patron_atipico",          label: "Alerta de seguridad",   icon: ShieldAlert, color: "#E24B4A", bg: "#FCEBEB" },
];

interface Notificacion {
  id: string;
  label: string;
  mensaje: string;
  icon: any;
  color: string;
  bg: string;
  tiempo: string;
  leida: boolean;
}

export default function NotificacionesPage() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("havi_token");
    const stored = localStorage.getItem("havi_user");
    if (!token || !stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    setUserId(u.user_id);
    cargarNotificaciones(u.user_id);
  }, [router]);

  const cargarNotificaciones = async (uid: string) => {
    setLoading(true);
    const tiempos = ["hace un momento", "hace 5 min", "hace 1 hora", "hace 2 horas", "hace ayer", "hace 2 días"];
    
    const triggers = ["pal_norte", "nomina", "cross_sell_seguro"];
    const resultados: Notificacion[] = [];

    for (let i = 0; i < triggers.length; i++) {
      const t = NOTIF_TRIGGERS.find(n => n.id === triggers[i])!;
      try {
        const data = await postTrigger(uid, triggers[i]);
        resultados.push({
          id: triggers[i],
          label: t.label,
          mensaje: data.mensaje,
          icon: t.icon,
          color: t.color,
          bg: t.bg,
          tiempo: tiempos[i],
          leida: i > 0,
        });
      } catch {}
    }
    setNotificaciones(resultados);
    setLoading(false);
  };

  const marcarLeida = (id: string) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen bg-hey-dark">
      <div className="bg-hey-card border-b border-hey-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-lg bg-hey-border flex items-center justify-center hover:bg-hey-border/80 transition-colors">
            <ArrowLeft size={16} className="text-hey-muted" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Bell size={18} className="text-hey-orange" />
            <span className="font-bold text-white text-sm">Notificaciones</span>
            {noLeidas > 0 && (
              <span className="bg-hey-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {noLeidas}
              </span>
            )}
          </div>
          <button onClick={() => setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))}
            className="text-xs text-hey-muted hover:text-hey-orange transition-colors">
            Marcar todas
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="text-hey-muted mx-auto mb-4" />
            <p className="text-hey-muted">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id}
                  onClick={() => marcarLeida(n.id)}
                  className={clsx(
                    "glass rounded-2xl p-4 cursor-pointer transition-all",
                    !n.leida && "border-hey-orange/30 border"
                  )}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: n.bg }}>
                      <Icon size={18} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: n.color }}>{n.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-hey-muted">{n.tiempo}</span>
                          {!n.leida && <div className="w-2 h-2 rounded-full bg-hey-orange" />}
                        </div>
                      </div>
                      <p className="text-sm text-white leading-relaxed">{n.mensaje}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push("/chat"); }}
                        className="mt-2 flex items-center gap-1 text-xs text-hey-orange hover:underline">
                        <MessageCircle size={12} />
                        Hablar con HEYA
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-hey-card border-t border-hey-border">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
          {[
            { label: "Inicio",    icon: "🏠", href: "/dashboard",       active: false },
            { label: "Chat",      icon: "💬", href: "/chat",            active: false },
            { label: "Alertas",   icon: "🔔", href: "/notificaciones",  active: true  },
            { label: "Perfil",    icon: "👤", href: "/perfil",          active: false },
          ].map(({ label, icon, href, active }) => (
            <button key={label} onClick={() => router.push(href)} className="flex flex-col items-center gap-1 px-4">
              <span className="text-xl">{icon}</span>
              <span className={`text-[10px] font-medium ${active ? "text-hey-orange" : "text-hey-muted"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}