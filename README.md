# HaviSense Backend

## Setup rápido (5 minutos)

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar API key
```bash
cp .env.example .env
# Edita .env y pega tu ANTHROPIC_API_KEY
```

### 3. Poner los CSVs
```
havisense-backend/
  data/
    hey_clientes.csv
    hey_productos.csv
    hey_transacciones.csv
```

### 4. Correr el servidor
```bash
uvicorn main:app --reload --port 8000
```

### 5. Verificar que funciona
Abre: http://localhost:8000/docs

---

## Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/perfil/{user_id}` | Perfil completo + segmento del usuario |
| POST | `/chat` | Chat con HEYA (conversación multi-turno) |
| POST | `/trigger` | Mensaje proactivo por evento |
| GET | `/insights/dashboard` | Métricas globales para el dashboard |
| GET | `/usuarios/sample` | 10 usuarios de muestra para el demo |

---

## Ejemplo de uso — Chat

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USR-00001",
    "mensaje": "Hola, me interesa un crédito personal",
    "historial": []
  }'
```

## Ejemplo de uso — Trigger

```bash
curl -X POST http://localhost:8000/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USR-00001",
    "trigger": "nomina"
  }'
```

### Triggers disponibles
- `nomina` — nómina recibida
- `rechazo_txn` — transacción rechazada
- `inactividad` — más de 30 días sin login
- `cross_sell_seguro` — tiene tarjeta pero no seguro
- `cross_sell_inversion` — ingreso alto sin inversión
- `patron_atipico` — actividad inusual detectada

---

## Cómo conectar con el frontend Next.js

```typescript
// En tu componente de chat
const res = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    mensaje: inputText,
    historial: conversationHistory
  })
})
const data = await res.json()
// data.respuesta → texto de HEYA
// data.segmento  → info del segmento del cliente
// data.perfil    → datos del cliente
```
