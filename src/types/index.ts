// types/index.ts

export interface AuthUser {
  user_id: string;
  nombre: string;
  rol: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  nombre: string;
  rol: string;
}

export interface Segmento {
  nombre: string;
  tono: string;
  perfil_cognitivo: string;
  color: string;
}

export interface PerfilCliente {
  user_id: string;
  edad: number;
  ocupacion: string;
  ingreso_mensual_mxn: number;
  score_buro: number;
  es_hey_pro: boolean;
  tiene_seguro: boolean;
  dias_desde_ultimo_login: number;
  satisfaccion: number;
  patron_uso_atipico: boolean;
  productos_activos: string[];
  categoria_gasto_top: string;
  transacciones_fallidas: number;
  segmento_id: number;
  segmento: Segmento;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface DashboardInsights {
  total_clientes: number;
  hey_pro: number;
  pct_hey_pro: number;
  churn_riesgo: number;
  pct_churn: number;
  insatisfechos: number;
  pct_insatisfechos: number;
  patron_atipico: number;
  cross_sell_seguro: number;
  cross_sell_inversion: number;
  txns_fallidas: number;
  categoria_gasto_top: Record<string, number>;
  segmentos: Record<string, number>;
}
