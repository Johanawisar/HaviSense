"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postChat, getPerfil } from "@/lib/api";
import type { ChatMessage, PerfilCliente } from "@/types";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import clsx from "clsx";

const C = {
  bg:"#ffffff", surface1:"#ececec", surface2:"#d5d5d5",
  text1:"#141223", text2:"#282828", muted:"#9f9f9f",
  orange:"#ff7403", violet:"#5e17eb", green:"#00bf63",
};

const TRIGGERS_RAPIDOS = [
  { label: "Quiero un crédito",   msg: "Hola, me interesa solicitar un crédito personal" },
  { label: "Ver mis gastos",      msg: "¿Puedes mostrarme un resumen de mis gastos?" },
  { label: "Tengo una duda",      msg: "Necesito ayuda con mi cuenta" },
  { label: "I need help",         msg: "Hi, I need help with my account" },
];

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("havi_token");
    const stored = localStorage.getItem("havi_user");
    if (!token || !stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    const uid = searchParams.get("user") ?? u.user_id;
    setUserId(uid);
    getPerfil(uid).then(setPerfil).catch(() => router.push("/login"));
    setMessages([{
      role: "assistant",
      content: "Hola, soy HEYA tu asistente de Hey Banco. ¿En qué te puedo ayudar hoy?",
      timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    }]);
  }, [router, searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (texto: string) => {
    if (!texto.trim() || !userId) return;
    const userMsg: ChatMessage = {
      role: "user", content: texto,
      timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTyping(true);
    setLoading(true);
    try {
      const historial = newMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
      const data = await postChat(userId, texto, historial);
      setMessages((prev) => [...prev, {
        role: "assistant", content: data.respuesta,
        timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant", content: "Lo siento, hubo un problema. Intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally { setTyping(false); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: C.text1, borderBottom: `1px solid ${C.surface2}` }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.orange }}>
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">HEYA</p>
              <p className="text-[10px] mt-0.5 font-semibold" style={{ color: "#00bf63" }}>En línea</p>
            </div>
          </div>
          {perfil && <span className="text-xs font-mono" style={{ color: C.muted }}>{perfil.user_id}</span>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-40">
        {messages.map((m, i) => (
          <div key={i} className={clsx("flex gap-3 animate-fade-up", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: m.role === "assistant" ? C.orange : C.violet }}>
              {m.role === "assistant" ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div className={clsx("max-w-[78%]", m.role === "user" ? "items-end" : "items-start")}>
              <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: m.role === "assistant" ? C.surface1 : C.violet,
                  color: m.role === "assistant" ? C.text2 : "#ffffff",
                  borderRadius: m.role === "assistant" ? "0 12px 12px 12px" : "12px 0 12px 12px",
                  border: m.role === "assistant" ? `1px solid ${C.surface2}` : "none",
                }}>
                {m.content}
              </div>
              <p className="text-[10px] px-1 mt-1" style={{ color: C.muted }}>{m.timestamp}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 animate-fade-up">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.orange }}>
              <Bot size={14} className="text-white" />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: C.surface1, border: `1px solid ${C.surface2}`, borderRadius: "0 12px 12px 12px" }}>
              <div className="flex gap-1">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: C.orange, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0" style={{ background: C.bg, borderTop: `1px solid ${C.surface2}` }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {TRIGGERS_RAPIDOS.map((t) => (
              <button key={t.label} onClick={() => sendMessage(t.msg)} disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all disabled:opacity-40 font-medium"
                style={{ background: C.surface1, border: `1px solid ${C.surface2}`, color: C.text2 }}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end rounded-2xl px-4 py-3"
            style={{ background: C.surface1, border: `1.5px solid ${C.surface2}` }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Escribe tu mensaje..."
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none focus:outline-none"
              style={{ color: C.text1 }}
            />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-40"
              style={{ background: C.orange }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}