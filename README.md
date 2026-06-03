# EDULAB - Frontend

Este repositorio contiene la interfaz de usuario (frontend) de **EDULAB**, una plataforma premium moderna tipo SaaS para la gestión y postulación inteligente de oportunidades internacionales, becas y voluntariados globales.

Construido utilizando **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

---

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* **Node.js** (versión 18 o superior recomendada)
* **pnpm** (gestor de paquetes rápido y eficiente utilizado en este proyecto)
  * Si no lo tienes instalado, ejecútalo globalmente con: `npm install -g pnpm`

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para clonar y levantar el proyecto localmente:

### 1. Clonar el repositorio
Abre una terminal y clona este repositorio:
```bash
git clone https://github.com/adrieduserver2025-cmd/edulab_frontend.git
cd edulab_frontend
```

### 2. Instalar las dependencias
Usa `pnpm` para instalar todos los módulos necesarios de forma rápida:
```bash
pnpm install
```

### 3. Configurar las Variables de Entorno
Copia el archivo de plantilla `.env.example` para crear tu archivo `.env` local:
```bash
cp .env.example .env
```
Abre el archivo `.env` recién creado en tu editor de código y configura las credenciales de **Firebase** y el endpoint del backend:
```env
VITE_API_URL=http://localhost:8000/api/v1

VITE_FIREBASE_API_KEY=TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=TU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
VITE_FIREBASE_APP_ID=TU_APP_ID
```

---

## 💻 Desarrollo Local

Para levantar el servidor de desarrollo local con recarga rápida (HMR):
```bash
pnpm dev
```
El servidor estará disponible por defecto en: [http://localhost:5173](http://localhost:5173)

---

## 📦 Producción y Construcción

Para generar el empaquetado optimizado para producción:
```bash
pnpm build
```

Para previsualizar localmente el bundle generado en producción:
```bash
pnpm preview
```

---

## 📁 Estructura del Proyecto

* `src/components/`: Componentes reutilizables (navegación, modales, etc.)
* `src/pages/`: Páginas principales de la aplicación (Dashboard, Detalle de Oportunidad, Perfil, etc.)
* `src/store/`: Gestión de estados globales con **Zustand**.
* `src/services/`: Clientes de API y peticiones HTTP.
* `src/routes/`: Configuración del enrutador de React (`react-router-dom`).
* `public/`: Recursos estáticos de uso público.
