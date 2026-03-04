---

# SmartSpend

A modern **Next.js** application powered by Convex, Inngest, and AI.

---

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Backend & Database:** Convex
* **Background Jobs:** Inngest
* **Media Storage:** Cloudinary
* **AI Integration:** Google Gemini, LlamaCloud, AI Gateway

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher recommended)
* **npm**, **yarn**, **pnpm**, or **bun**

---

## 🛠️ Local Development Setup

Follow these steps to get the project running locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/smartspend.git
cd smartspend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env.local` file in the root directory of the project.

Populate it with the following variables:

```env
# --- Cloudinary (Media Management) ---
# Get these from your Cloudinary Dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- AI & LLM Services ---
# LlamaCloud
LLAMA_CLOUD_API_KEY=

# AI Gateway (e.g., Cloudflare / Portkey)
AI_GATEWAY_API_KEY=

# Google Gemini
GEMINI_API_KEY=

# --- Convex (Backend / Database) ---
# NOTE: Running `npx convex dev` will typically auto-populate these
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
```

---

### 4️⃣ Run Development Servers

This architecture requires running **Next.js**, **Convex**, and **Inngest** simultaneously.

Open **three separate terminal windows** in the project root:

---

#### 🖥 Terminal 1 — Start Convex Backend

```bash
npx convex dev
```

If this is your first time running Convex, you’ll be prompted to log in.
Convex will automatically configure your `.env.local` with development deployment keys.

---

#### 🖥 Terminal 2 — Start Inngest Dev Server

```bash
npx --ignore-scripts=false inngest-cli@latest dev
```