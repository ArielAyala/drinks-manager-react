# 🍹 Drinks Manager

Aplicación ligera y mobile-first para administrar un puesto de bebidas y tragos. Desarrollada con React + TypeScript + Tailwind CSS como una Progressive Web App (PWA).

## ✨ Características

### Gestión de Insumos
- Registro de inversiones en bebidas, estante, hielo, vasos y otros insumos
- Historial de compras agrupado por fecha
- Edición y eliminación de registros

### Gestión de Tragos
- 7 tragos precargados (Caipirinha, Mojito, Margarita, Piña Colada, Cuba Libre, Daiquiri de Durazno, Daiquiri de Frutilla)
- Precio base de 15.000 ₲ (Guaraníes)
- Posibilidad de editar precios, agregar nuevos tragos o desactivar temporalmente

### Registro de Ventas
- Interfaz intuitiva estilo PedidosYa
- Selector de cantidad con botones +/-
- Visualización del total en tiempo real
- Historial de ventas por día

### Reportes
- **Reporte Diario**: Total vendido y desglose por trago
- **Reporte Total**: Ganancia neta, ROI, inversión por categoría
- Exportación a CSV de ventas, insumos y reporte total

### Otras características
- PWA instalable en iOS/Android
- Datos persistidos en localStorage
- Modo oscuro optimizado para uso nocturno
- Versión de la app visible en header

## 🚀 Instalación

### Requisitos previos
- Node.js 18+
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/drinks-manager-react.git

# Entrar al directorio
cd drinks-manager-react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📱 Instalación como PWA (iOS)

1. Abre la aplicación en Safari
2. Toca el botón de compartir (icono de cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma el nombre y toca "Agregar"

## 🛠️ Tecnologías

- **React 19** - UI library
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **Vite** - Build tool
- **vite-plugin-pwa** - Soporte PWA
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Layout.tsx          # Layout principal con header y nav
│   ├── Navigation.tsx      # Barra de navegación inferior
│   ├── ui/                 # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── QuantitySelector.tsx
│   └── views/              # Vistas principales
│       ├── HomeView.tsx    # Dashboard principal
│       ├── SuppliesView.tsx # ABM de insumos
│       ├── DrinksView.tsx  # ABM de tragos
│       ├── SalesView.tsx   # Registro de ventas
│       ├── ReportsView.tsx # Reportes y exportación
│       └── SettingsView.tsx # Configuración
├── hooks/
│   ├── useLocalStorage.ts  # Hook para persistencia
│   └── useStore.ts         # Hooks de estado (supplies, drinks, sales)
├── types/
│   └── index.ts            # Interfaces y tipos
├── utils/
│   ├── format.ts           # Formateo de moneda y fechas
│   └── reports.ts          # Lógica de reportes y exportación
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 💰 Moneda

La aplicación utiliza **Guaraníes (PYG)** como moneda. Todos los valores son enteros (sin decimales).

## 🔧 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run preview  # Preview del build
npm run build    # Build de producción
npm run lint     # Linter
```

## 📄 Licencia

MIT

---

Desarrollado con ❤️ para tu negocio de bebidas
