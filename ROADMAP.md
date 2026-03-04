---

# 🚀 SmartSpend (Bank Statement Analyzer) – Product Roadmap

This document outlines the current state, immediate next steps for the Minimum Viable Product (MVP), and the long-term vision for the SmartSpend financial analysis dashboard.

---

## 🟢 Phase 1: Completed (Current State)

### ✅ What We Have Built So Far

### Architecture & Storage

* [x] **Next.js App Router Setup**
  Modern architecture with Server Actions and Client Components.

* [x] **Temporary Sessions (Middleware)**
  Secure `httpOnly` cookie management generating UUIDs on initial page load.

* [x] **Convex Database Integration**

  * Upsert logic based on `sessionId` via server mutations.
  * Transactions schema structured for analytical extraction (`amount`, `category`, `date`, `description`, `type`).

* [x] **PDF Statement Upload Action**
  Handles form `onSubmit`, form data parsing, and AI-driven processing pipeline.

---

### Frontend Features & Components

* [x] **Upload & Demo Cards**
  User flow for statement submission with proper error handling.

* [x] **Animated Loading States**
  Multi-stage progress bar using Lottie and Tailwind
  (“Crunching numbers…”, “Tidying up…”).

* [x] **Busiest Day Analysis (MostTransactionDay)**
  Single-pass **O(N)** logic calculating the date with the highest transaction volume and rendering its transactions.

* [x] **Spendings List (Spendings)**
  Cleanly formatted transaction feed:

  * Green → Credits
  * Red → Debits
  * Localized ₦ currency formatting

* [x] **Smart Insights (Insights)**
  Numbered UI card mapped to AI-generated financial summaries with professional disclaimer.

* [x] **Client-Side Error Boundaries**
  Custom `error.tsx` replacing standard Next.js/Vercel crashes with branded recovery UI.

---

## 🟡 Phase 2: MVP Completion (What We Need Now)

### 🎯 Final Polish Required for Public Launch

### UX & Layout Overhaul

* [ ] **Data Filtering & Search**
  Add a global search bar so users can filter merchants (e.g., “MTN”, “Cowrywise”) within the transactions list.

---

### Core User Controls

* [ ] **Session Management ("Start Over" Button)**
  Clear the current session and allow uploading a new statement.

* [ ] **Export Options**

  * Download cleaned JSON data as CSV
  * Download dashboard as static PDF report

* [ ] **Empty States Handling**
  Ensure all components gracefully handle:

  * Zero transactions
  * Zero income
  * No detected insights

---

## 🟣 Phase 3: Future Enhancements (V2 & Beyond)

### 🤖 AI & Deep Analytics

* [ ] **Multi-Month Trending**
  Analyze patterns over 3–6 months and show Month-over-Month spending changes.

* [ ] **Predictive Cash Flow**
  AI detects recurring payments and warns users if they risk overdrawing before next income.

* [ ] **Smart Budgeting Goals**
  Example:

  > “You spent ₦50,000 on transfers last month. Set a cap of ₦40,000 this month?”

---

### 🏗 Infrastructure Expansion

* [ ] **Persistent User Accounts**
  Move from anonymous sessions to full authentication (Clerk / NextAuth), saving dashboard history permanently.

* [ ] **Direct Bank Linking (Open Banking API)**
  Replace PDF uploads by integrating with aggregators like Mono or Okra for real-time sync.

* [ ] **Custom Categories**
  Allow users to override AI categorization rules
  (e.g., “Always mark ‘Ozondi’ as Debt Repayment”).

* [ ] **PWA / Mobile Wrapper**
  Wrap the Next.js frontend in:

  * PWA manifest
  * Or React Native mobile wrapper
    So users can install the app directly.

---

## 🛠 Tech Stack Summary

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + Shadcn UI
* **Icons:** Lucide React
* **Backend/Database:** Convex
* **Animations:** Lottie-React
* **AI Processing:** LLM API (Prompt-driven parsing)

---