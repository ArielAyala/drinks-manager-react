# 🍹 Drinks Manager

Lightweight, mobile-first application for managing a drinks and cocktails stand. Built with React + TypeScript + Tailwind CSS as a Progressive Web App (PWA).

## ✨ Features

### Supplies Management
- Track investments in drinks, shelves, ice, cups, and other supplies
- Purchase history grouped by date
- Edit and delete records

### Drinks Management
- 7 preloaded cocktails (Caipirinha, Mojito, Margarita, Piña Colada, Cuba Libre, Peach Daiquiri, Strawberry Daiquiri)
- Base price of 15,000 ₲ (Guaraníes)
- Edit prices, add new drinks, or temporarily deactivate them

### Sales Registration
- Intuitive PedidosYa-style interface
- Quantity selector with +/- buttons
- Real-time total visualization
- Daily sales history

### Reports
- **Daily Report**: Total sales and breakdown by drink
- **Total Report**: Net profit, ROI, investment by category
- CSV export of sales, supplies, and total report

### Other Features
- Installable PWA on iOS/Android
- Data persisted in localStorage
- Dark mode optimized for nighttime use
- App version visible in header

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/ArielAyala/drinks-manager-react.git

# Enter directory
cd drinks-manager-react

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 Installing as PWA (iOS)

1. Open the app in Safari
2. Tap the share button (square icon with arrow)
3. Select "Add to Home Screen"
4. Confirm the name and tap "Add"

## 🛠️ Technologies

- **React 19** - UI library
- **TypeScript** - Static typing
- **Tailwind CSS 4** - Utility-first styles
- **Vite** - Build tool
- **vite-plugin-pwa** - PWA support
- **Lucide React** - Icons
- **date-fns** - Date handling

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with header and nav
│   ├── Navigation.tsx      # Bottom navigation bar
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── QuantitySelector.tsx
│   └── views/              # Main views
│       ├── HomeView.tsx    # Main dashboard
│       ├── SuppliesView.tsx # Supplies CRUD
│       ├── DrinksView.tsx  # Drinks CRUD
│       ├── SalesView.tsx   # Sales registration
│       ├── ReportsView.tsx # Reports and export
│       └── SettingsView.tsx # Settings
├── hooks/
│   ├── useLocalStorage.ts  # Persistence hook
│   └── useStore.ts         # State hooks (supplies, drinks, sales)
├── types/
│   └── index.ts            # Interfaces and types
├── utils/
│   ├── format.ts           # Currency and date formatting
│   └── reports.ts          # Reports logic and export
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 💰 Currency

The app uses **Guaraníes (PYG)** as currency. All values are integers (no decimals).

## 🔧 Available Scripts

```bash
npm run dev      # Development server
npm run preview  # Preview build
npm run build    # Production build
npm run lint     # Linter
```

## 📄 License

MIT

---

Developed with ❤️ for your drinks business
