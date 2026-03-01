# BLUEPRINT.md
## MikroTik Semi-ISP Dashboard (Internal Project)

---

# 🎯 PROJECT GOAL

Membangun dashboard internal untuk monitoring dan manajemen user MikroTik berbasis REST API.

Fokus:
- Monitoring usage
- Monitoring active sessions
- FUP / throttle management
- User management
- Real-time feel (polling)

Bukan SaaS. Bukan multi-tenant. Pure internal control panel.

---

# 🧱 TECH STACK

Core:
- Vite
- React
- TypeScript
- React Router
- TailwindCSS

Data Layer:
- Axios
- TanStack Query

UI:
- Recharts

Optional:
- Zustand (untuk auth state jika diperlukan)

---

# 📁 PROJECT STRUCTURE

src/
│
├── main.tsx
├── App.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Overview.tsx
│   ├── Customers.tsx
│   ├── CustomerDetail.tsx
│   ├── Sessions.tsx
│   └── Throttled.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── tables/
│   │   └── CustomersTable.tsx
│   │
│   └── charts/
│       └── UsageChart.tsx
│
├── hooks/
│   ├── useSummary.ts
│   ├── useUsers.ts
│   ├── useUserDetail.ts
│   ├── useSessions.ts
│   └── useThrottled.ts
│
├── lib/
│   ├── api.ts
│   └── auth.ts
│
├── store/
│   └── authStore.ts
│
└── types/
    └── api.ts

---

# 🔐 AUTHENTICATION FLOW

1. Login → POST /api/v1/auth/login
2. Simpan access_token ke localStorage
3. Axios interceptor inject Authorization: Bearer <token>
4. ProtectedRoute cek token
5. Jika 401 → logout dan redirect ke login

---

# 🌐 ROUTING STRUCTURE

/login
/overview
/customers
/customers/:username
/sessions
/throttled

---

# 📡 DATA FLOW RULES

Semua API call HARUS melalui TanStack Query.

Polling interval:
- Summary → 30 detik
- Sessions → 15 detik
- User detail → 10 detik

Jangan fetch manual pakai useEffect kecuali untuk mutation.

---

# 📊 PAGE SPECIFICATION

## 1️⃣ Login Page

Fitur:
- Form username
- Form password
- Submit login
- Redirect ke /overview jika sukses

---

## 2️⃣ Overview Page

Endpoint:
- GET /summary
- GET /sessions
- GET /throttled

UI:
- Card total usage bulan ini
- Card total active session
- Card total throttled user
- Bar chart Top 5 Users

---

## 3️⃣ Customers Page

Endpoint:
- GET /users

Table columns:
- Username
- Enabled status
- Threshold
- Action buttons

Actions:
- Detail
- Kick
- Set Limit
- Force Throttle
- Toggle FUP
- Delete

---

## 4️⃣ Customer Detail Page

Endpoint:
- GET /status/{username}
- GET /logs/{username}

UI:
- Progress bar usage
- Status badge (normal / throttled)
- Last action timestamp
- Log history table
- Quick action buttons

---

## 5️⃣ Sessions Page

Endpoint:
- GET /sessions

Table:
- Username
- IP Address
- Uptime
- Kick button

Polling setiap 15 detik.

---

## 6️⃣ Throttled Page

Endpoint:
- GET /throttled

UI:
- List user yang sedang throttled
- Button force normal

---

# 🧩 TYPE DEFINITIONS (types/api.ts)

export interface SummaryResponse {
  month: string
  total_usage_gb: number
  top_users: {
    username: string
    usage_gb: number
  }[]
}

export interface User {
  username: string
  enabled: boolean
  threshold_gb: number
}

export interface UserStatus {
  username: string
  usage_gb: number
  threshold_gb: number
  enabled: boolean
  state: "normal" | "throttled"
  last_action: string
}

---

# 🧠 AXIOS CONFIG RULES

- Base URL dari .env
- Auto inject Bearer token
- Global response interceptor:
  - Jika 401 → clear token → redirect login

---

# 🎨 UI RULES

Layout:
- Sidebar kiri
- Navbar atas
- Main content kanan

Theme:
- Default dark mode
- Biru → normal
- Merah → throttled
- Kuning → warning

Gunakan reusable UI components untuk:
- Card
- Badge
- Button
- Modal
- ProgressBar

---

# 🚀 BUILD ORDER

1. Setup Vite + TypeScript
2. Setup Tailwind
3. Setup Router
4. Setup Axios + Interceptor
5. Setup Auth + ProtectedRoute
6. Build Overview
7. Build Customers
8. Build Customer Detail
9. Build Sessions
10. Build Throttled
11. Polish UI + Error Handling

---

# 📌 DEVELOPMENT RULES

- Gunakan TypeScript di semua file
- Jangan hardcode dummy data
- Jangan buat endpoint tambahan
- Pisahkan logic dan UI
- Semua API call melalui hooks

END OF FILE