"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPerfil, postTrigger } from "@/lib/api";
import type { PerfilCliente } from "@/types";
import { MessageCircle, ShieldAlert, TrendingUp, ArrowRight, Star, Zap, Bell } from "lucide-react";

const HORA_SALUDO = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
};

const PRODUCTO_LABEL: Record<string, string> = {
  cuenta_debito: "Cuenta débito", tarjeta_credito_hey: "Tarjeta Hey",
  tarjeta_credito_garantizada: "Tarjeta garantizada", tarjeta_credito_negocios: "Tarjeta negocios",
  credito_personal: "Crédito personal", credito_auto: "Crédito auto",
  credito_nomina: "Crédito nómina", inversion_hey: "Hey Inversión",
  seguro_vida: "Seguro de vida", seguro_compras: "Seguro compras",
  cuenta_negocios: "Cuenta negocios",
};

const C = {
  bg:       "#ffffff",
  surface1: "#ececec",
  surface2: "#d5d5d5",
  celeste:  "#7ebef7",
  text1:    "#141223",
  text2:    "#282828",
  muted:    "#9f9f9f",
  muted2:   "#a5a5a5",
  green:    "#00bf63",
  greenV:   "#b9f148",
  violet:   "#5e17eb",
  pink:     "#f966f1",
  yellow:   "#fae244",
  orange:   "#ff7403",
  red:      "#d01818",
  redL:     "#e1cbcb",
};

export default function HomePage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [oferta, setOferta] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("havi_token");
    const stored = localStorage.getItem("havi_user");
    if (!token || !stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    getPerfil(u.user_id).then((p) => {
      setPerfil(p);
      const trigger = p.patron_uso_atipico ? "patron_atipico" : !p.tiene_seguro ? "cross_sell_seguro" : "nomina";
      postTrigger(u.user_id, trigger).then((d) => setOferta(d.mensaje)).catch(() => {});
    }).catch(() => router.push("/login")).finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: C.orange, borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: C.muted }}>Cargando tu perfil...</p>
      </div>
    </div>
  );
  if (!perfil) return null;

  const nombre = perfil.user_id.replace("USR-", "Cliente ");
  const scoreColor = perfil.score_buro >= 700 ? C.green : perfil.score_buro >= 600 ? C.yellow : C.red;
  const scoreLabel = perfil.score_buro >= 700 ? "Excelente" : perfil.score_buro >= 600 ? "Bueno" : "En desarrollo";

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: C.text1, borderBottom: `1px solid ${C.surface2}` }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.orange }}>
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="font-bold text-white text-sm">Hey Banco</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/notificaciones")}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${C.pink}22` }}>
              <Bell size={16} style={{ color: C.pink }} />
            </button>
            <button onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="text-xs px-2 py-1 rounded-lg" style={{ color: C.muted }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-24">

        {/* Saludo */}
        <div className="pt-6 pb-4 animate-fade-up">
          <p className="text-sm" style={{ color: C.muted }}>{HORA_SALUDO()},</p>
          <h1 className="text-2xl font-bold" style={{ color: C.text1 }}>{nombre} 👋</h1>
          <p className="text-xs mt-1 font-semibold" style={{ color: C.violet }}>
            {perfil.segmento?.nombre} · Perfil {perfil.segmento?.perfil_cognitivo}
          </p>
        </div>

        {/* Score card — superficie oscura para contraste */}
        <div className="rounded-3xl p-6 mb-4 animate-fade-up"
          style={{ background: C.text1, animationDelay: "0.1s" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>Score crediticio</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-white">{perfil.score_buro}</span>
                <span className="text-xs font-bold" style={{ color: scoreColor }}>{scoreLabel}</span>
              </div>
            </div>
            {perfil.es_hey_pro && (
              <div className="flex items-center gap-1 rounded-full px-3 py-1.5"
                style={{ background: `${C.orange}22`, border: `1px solid ${C.orange}` }}>
                <Star size={12} style={{ color: C.orange }} />
                <span className="text-xs font-bold" style={{ color: C.orange }}>Hey Pro</span>
              </div>
            )}
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((perfil.score_buro - 295) / 555) * 100}%`, background: scoreColor }} />
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: C.muted }}>
            <span>295</span><span>850</span>
          </div>
        </div>

        {/* Oferta HEYA */}
        {oferta && (
          <div className="rounded-2xl p-4 mb-4 animate-fade-up"
            style={{ background: C.surface1, border: `2px solid ${C.orange}`, animationDelay: "0.2s" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: C.orange }}>
                <Zap size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.orange }}>HEYA para ti</p>
                <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{oferta}</p>
              </div>
            </div>
            <button onClick={() => router.push("/chat")}
              className="mt-3 w-full flex items-center justify-center gap-2 text-white text-xs font-bold py-2.5 rounded-xl"
              style={{ background: C.orange }}>
              <MessageCircle size={14} /> Hablar con HEYA
            </button>
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-3 gap-3 mb-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {[
            { label: "Chat HEYA", icon: MessageCircle, color: C.orange,  bg: `${C.orange}15`,  href: "/chat"   },
            { label: "Productos",  icon: TrendingUp,   color: C.green,   bg: `${C.green}15`,   href: "/perfil" },
            { label: "Seguridad",  icon: ShieldAlert,  color: C.violet,  bg: `${C.violet}15`,  href: "/chat"   },
          ].map(({ label, icon: Icon, color, bg, href }) => (
            <button key={label} onClick={() => router.push(href)}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform active:scale-95"
              style={{ background: C.surface1, border: `1.5px solid ${color}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-[11px] font-bold text-center" style={{ color }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Mis productos */}
        <div className="rounded-2xl p-5 mb-4 animate-fade-up"
          style={{ background: C.surface1, animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: C.text1 }}>Mis productos</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: C.violet, color: "#fff" }}>
              {perfil.productos_activos.length} activos
            </span>
          </div>
          <div className="space-y-3">
            {perfil.productos_activos.slice(0, 4).map((p) => (
              <div key={p} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${C.green}18` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: C.green }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: C.text2 }}>
                    {PRODUCTO_LABEL[p] ?? p.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: C.green }}>Activo</span>
              </div>
            ))}
            {!perfil.tiene_seguro && (
              <div className="flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: C.redL }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: C.red }} />
                  </div>
                  <span className="text-sm" style={{ color: C.muted2 }}>Seguro de compras</span>
                </div>
                <button onClick={() => router.push("/chat")}
                  className="text-xs font-bold" style={{ color: C.orange }}>Activar</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="rounded-2xl p-4" style={{ background: C.surface1 }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Satisfacción</p>
            <p className="text-2xl font-bold" style={{ color: C.text1 }}>
              {perfil.satisfaccion}
              <span className="text-sm" style={{ color: C.muted }}>/10</span>
            </p>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full"
                  style={{ background: i < perfil.satisfaccion ? C.greenV : C.surface2 }} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.surface1 }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Gasto frecuente</p>
            <p className="text-sm font-bold capitalize mt-1" style={{ color: C.text1 }}>
              {perfil.categoria_gasto_top?.replace(/_/g, " ")}
            </p>
            <p className="text-xs mt-1 font-semibold" style={{ color: C.violet }}>categoría principal</p>
          </div>
        </div>

        {/* Alerta atípico */}
        {perfil.patron_uso_atipico && (
          <div className="mt-4 rounded-2xl p-4 animate-fade-up flex items-center gap-3"
            style={{ background: C.redL, border: `1.5px solid ${C.red}` }}>
            <ShieldAlert size={20} style={{ color: C.red }} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: C.red }}>Actividad inusual detectada</p>
              <p className="text-xs mt-0.5" style={{ color: C.text2 }}>Revisa tus movimientos con HEYA</p>
            </div>
            <button onClick={() => router.push("/chat")} className="ml-auto flex-shrink-0">
              <ArrowRight size={16} style={{ color: C.red }} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0"
        style={{ background: C.text1, borderTop: `1px solid ${C.surface2}` }}>
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
          {[
            { label: "Inicio",  icon: "🏠", href: "/dashboard",      active: true  },
            { label: "Chat",    icon: "💬", href: "/chat",           active: false },
            { label: "Alertas", icon: "🔔", href: "/notificaciones", active: false },
            { label: "Perfil",  icon: "👤", href: "/perfil",         active: false },
          ].map(({ label, icon, href, active }) => (
            <button key={label} onClick={() => router.push(href)} className="flex flex-col items-center gap-1 px-4">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-bold"
                style={{ color: active ? C.orange : C.muted }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}