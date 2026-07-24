# Qarmi Salud - Prototipo APF2

Experiencia culinaria premium que fusiona los superalimentos andinos con la alta cocina moderna.

## Características

- 🥗 Menú saludable con ingredientes andinos
- 👨‍💼 Dashboards administrativos (Cocina, Caja, Reportes)
- 🛒 Sistema de carrito de compras
- 💳 Múltiples métodos de pago
- 📊 Reportes y análisis en tiempo real
- ⚡ Rendimiento optimizado con React + Vite

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables (Navbar, Sidebar)
├── screens/             # Páginas principales
│   ├── LandingPage.tsx         # Página de inicio
│   ├── MenuPage.tsx            # Menú de productos
│   ├── ProductDetail.tsx       # Detalle de producto
│   ├── CheckoutPage.tsx        # Carrito y checkout
│   ├── ConfirmationPage.tsx    # Confirmación de pedido
│   ├── AdminDashboard.tsx      # Dashboard principal
│   ├── KitchenDashboard.tsx    # Vista de cocina
│   ├── CashierDashboard.tsx    # Vista de caja
│   └── ReportsDashboard.tsx    # Reportes
├── lib/                 # Utilidades
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales

```

## Tecnologías

- **React 19.2** - UI Framework
- **TypeScript** - Type safety
- **Vite 6.4** - Build tool
- **Tailwind CSS 3.4** - Styling
- **React Router 7.15** - Routing
- **Recharts 3.8** - Gráficos
- **Lucide React 1.16** - Iconos
- **Motion** - Animaciones

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo (port 3000)
- `npm run build` - Crea build para producción
- `npm run preview` - Vista previa del build
- `npm audit fix` - Corrige vulnerabilidades de seguridad

## Optimizaciones

✅ Tailwind CSS configurado con PostCSS
✅ Code splitting con vendor chunks
✅ Minificación con Terser
✅ CSS purificado (~35KB gzipped)
✅ Cero vulnerabilidades de seguridad
✅ Typings completos con TypeScript

## Notas de Desarrollo

- El servidor inicia en `http://localhost:3001/` si el puerto 3000 está en uso
- HMR (Hot Module Replacement) habilitado para desarrollo rápido
- Los dashboards requieren integración con backend para datos reales

## Licencia

© 2024 Qarmi Salud. Todos los derechos reservados.
