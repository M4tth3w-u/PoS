# Retro Billiard & Dining POS — Staff & Admin Portal

A modern, responsive Point of Sale (POS) and administrative portal front-end built with **React 19**, **Vite**, and **React Compiler**.

---

## Tech Stack & Architecture

* **Framework**: [React 19](https://react.dev/)
* **Compiler**: [React Compiler](https://react.dev/learn/react-compiler) (`babel-plugin-react-compiler`)
  * Automatically optimizes components with fine-grained memoization and eliminates redundant re-renders out of the box.
  * Integrated directly into Vite via `@vitejs/plugin-react`.
* **Bundler & Dev Server**: [Vite 8](https://vite.dev/) with Instant Hot Module Replacement (HMR).
* **Styling**: Vanilla CSS Design System
  * **Background**: `#121826`
  * **Surface**: `#1E2536`
  * **Primary (Sky Blue)**: `#38BDF8`
  * **Accent (Indigo)**: `#818CF8`
  * **Text**: `#E2E8F0`
  * **Alert**: `#F87171`
* **Icons**: [Lucide React](https://lucide.dev/)

---

## Features

* **Adaptive Responsive Layout**:
  * **Desktop (> 960px)**: Two-column split view featuring an architectural arched vault showcase with cyan/indigo neon rim lighting and an elevated floating console pod.
  * **Mobile & Tablet (< 960px)**: Single-column centered card topped with an authentic curved arch brand crest.
* **Role-Based Flow (Staff vs. Administrator)**:
  * Segmented control to switch between **Staff / Cashier** and **Administrator** access.
  * Automatically clears both input textboxes and pending alert states when changing roles.
* **Interactive Micro-Animations**:
  * Glowing focus rings with expanding bottom accent lines on inputs.
  * Smooth password visibility toggle (`Eye` / `EyeOff`).
  * Tactile button states with elevation lift and click squeeze effects.
  * Native CSS `:focus-within` styling for immediate, reliable feedback.
* **Bilingual Support**: Instant toggle between English (`EN`) and Indonesian (`ID`).
* **Clean Front-End Integration**: Pure client-side architecture; form submissions emit clean payload data ready for API connection.

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
* NPM

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/M4tth3w-u/PoS.git
cd PoS
npm install
```

### Running Locally
Start the development server with live HMR:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Building for Production
Compile and bundle optimized static assets:

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready to be served by any static host or web server.
