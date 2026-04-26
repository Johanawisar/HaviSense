"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postTrigger } from "@/lib/api";
import { Bell, MessageCircle, ArrowLeft, ShieldAlert, TrendingUp, Zap, Music, Star } from "lucide-react";
import clsx from "clsx";

const C = {
  bg:"#ffffff", surface1:"#ececec", surface2:"#d5d5d5",
  text1:"#141223", text2:"#282828", muted:"#9f9f9f",
  green:"#00bf63", violet:"#5e17eb", pink:"#f966f1",
  orange:"#ff7403", red:"#d01818", redL:"#e1cbcb",
};

const NOTIF_TRIGGERS = [
  { id: "pal_norte",            label: "Pal Norte 2026",     icon: Music,       color: C.orange, bg: "#fff3e0" },
  { id: "nomina",               label: "Nómina recibida",    icon: Star,        color: C.green,  bg: "#e8f5e9" },
  { id: "cross_sell_seguro",    label: "Oferta de seguro",   icon: ShieldAlert, color: C.violet, bg: "#ede7f6" },
];

interface Notificacion {
  id: string; label: string; mensaje: string;
  icon: any; color: string; bg: string;
  tiempo: string; leida: boolean;
}

export default function NotificacionesPage() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("havi_token");
    const stored = localStorage.getItem("havi_user");
    if (!token || !stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    cargarNotificaciones(u.user_id);
  }, [router]);

  const cargarNotificaciones = async (uid: string) => {
    setLoading(true);
    const tiempos = ["hace un momento", "hace 5 min", "hace 1 hora"];
    const resultados: Notificacion[] = [];
    for (let i = 0; i < NOTIF_TRIGGERS.length; i++) {
      const t = NOTIF_TRIGGERS[i];
      try {
        const data = await postTrigger(uid, t.id);
        resultados.push({ ...t, mensaje: data.mensaje, tiempo: tiempos[i], leida: i > 0 });
      } catch {}
    }
    setNotificaciones(resultados);
    setLoading(false);
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: C.text1 }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Bell size={18} style={{ color: C.pink }} />
            <span className="font-bold text-white text-sm">Notificaciones</span>
            {noLeidas > 0 && (
              <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: C.orange }}>{noLeidas}</span>
            )}
          </div>
          <button onClick={() => setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))}
            className="text-xs font-medium" style={{ color: C.muted }}>
            Marcar todas
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-4" style={{ background: C.surface1 }}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-4 skeleton rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id}
                  onClick={() => setNotificaciones(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x))}
                  className="rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    background: C.surface1,
                    border: !n.leida ? `2px solid ${n.color}` : `1px solid ${C.surface2}`,
                  }}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: n.bg }}>
                      <Icon size={18} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: n.color }}>{n.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: C.muted }}>{n.tiempo}</span>
                          {!n.leida && <div className="w-2 h-2 rounded-full" style={{ background: n.color }} />}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{n.mensaje}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push("/chat"); }}
                        className="mt-2 flex items-center gap-1 text-xs font-bold"
                        style={{ color: C.orange }}>
                        <MessageCircle size={12} /> Hablar con HEYA
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0" style={{ background: C.text1, borderTop: `1px solid rgba(255,255,255,0.08)` }}>
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
          {[
            { label: "Inicio",  icon: "🏠", href: "/dashboard",      active: false },
            { label: "Chat",    icon: "💬", href: "/chat",           active: false },
            { label: "Alertas", icon: "🔔", href: "/notificaciones", active: true  },
            { label: "Perfil",  icon: "👤", href: "/perfil",         active: false },
          ].map(({ label, icon, href, active }) => (
            <button key={label} onClick={() => router.push(href)} className="flex flex-col items-center gap-1 px-4">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-bold" style={{ color: active ? C.orange : C.muted }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}