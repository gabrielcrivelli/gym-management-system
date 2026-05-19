# Gym Management System

Sistema de gestión para gimnasios construido con **Next.js 14**, **Prisma ORM**, **TypeScript** y **Tailwind CSS**.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM (PostgreSQL)
- **Auth**: NextAuth.js
- **Notifications**: Email + WhatsApp

## 📋 Features

- ✅ Gestión de miembros
- ✅ Control de asistencia
- ✅ Gestión de pagos
- ✅ Planes y membresías
- ✅ Notificaciones automáticas (email/WhatsApp)
- ✅ Reportes y estadísticas
- ✅ Configuración del sistema

## 🛠️ Setup

```bash
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
npm run dev
```

## 📁 Project Structure

```
gym-management-system/
├── prisma/          # Database schema
├── src/
│   ├── app/         # Next.js App Router pages & API routes
│   ├── components/  # Reusable UI components
│   ├── lib/         # Utilities, DB, Auth, Notifications
│   └── hooks/       # Custom React hooks
```
