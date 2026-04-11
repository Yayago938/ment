# MentorLink — React + Vite + Tailwind CSS

A premium academic mentorship platform built with React, Vite, and Tailwind CSS.  
Converted from the original HTML prototypes, preserving the **Ethereal Academic** design system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
mentorlink/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              # App entry, React Router setup
    ├── index.css             # Tailwind directives + global styles
    ├── components/
    │   ├── Sidebar.jsx       # Left navigation sidebar
    │   └── TopNav.jsx        # Top navigation bar
    └── pages/
        ├── SignUpLogin.jsx   # Login / Sign Up page (/)
        ├── FindingMatches.jsx  # Loading/matching screen (/finding-matches)
        ├── CommitteeDetail.jsx # Committee detail view (/committee-detail)
        └── MyApplications.jsx  # Applications dashboard (/applications)
```

---

## 🎨 Design System — The Ethereal Academic

This project uses a **High-Fidelity Pastel** color palette with the following key tokens:

| Token | Value | Use |
|---|---|---|
| `primary` | `#5545ce` | Main brand purple |
| `secondary-container` | `#feadc8` | Accent pink |
| `surface` | `#faf8ff` | Page background |
| `surface-container-low` | `#f4f3fa` | Section backgrounds |
| `surface-container-lowest` | `#ffffff` | Cards |

### Typography
- **Manrope** — Headlines and display text
- **Inter** — Body copy and labels

### Key Design Rules
- No 1px borders — use background shifts for visual separation
- Pill-shaped buttons and inputs (`rounded-full`)
- Gradient CTAs: `from-primary to-secondary-container` at 135°
- Ambient shadows tinted with purple: `rgba(123, 110, 246, 0.08)`
- Glassmorphism on navigation: `backdrop-filter: blur(20px)`

---

## 🗺️ Pages / Routes

| Route | Page | Description |
|---|---|---|
| `/login` | SignUpLogin | Authentication with toggle between Login & Sign Up |
| `/finding-matches` | FindingMatches | Animated loading screen while matches are computed |
| `/committee-detail` | CommitteeDetail | Full committee/guild profile with gallery, team & events |
| `/applications` | MyApplications | Dashboard to track application statuses with filters |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^6.20.0 | Client-side routing |
| vite | ^5.0.8 | Build tool & dev server |
| tailwindcss | ^3.3.6 | Utility-first CSS |
| @vitejs/plugin-react | ^4.2.0 | React JSX fast refresh |
| autoprefixer | ^10.4.16 | CSS vendor prefixes |
| postcss | ^8.4.32 | CSS processing |
