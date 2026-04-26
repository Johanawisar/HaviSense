# HaviSense Frontend — Next.js + TypeScript

## Setup en 3 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar URL del backend
```bash
# Crear .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 3. Correr
```bash
npm run dev
# → http://localhost:3000
```

---

## Credenciales de demo
```
Email:    usr-00001@hey.mx
Password: usr-00001
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/login` | Login con JWT |
| `/dashboard` | Métricas globales + tabla de usuarios |
| `/chat?user=USR-XXXXX` | Chat con HEYA |
| `/perfil` | Perfil del cliente + triggers proactivos |

---

## Conectar con el backend

El frontend se comunica con el backend via `src/lib/api.ts`.
El token JWT se guarda en `localStorage` y se inyecta en cada request automáticamente.

Si el token expira, redirige automáticamente a `/login`.
