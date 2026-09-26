# StockSense — Modern Enterprise Inventory Management System

StockSense is an enterprise-grade, responsive frontend dashboard for inventory tracking, multi-warehouse logistics, cycle count adjustments, perpetual stock ledger auditing, and AI predictive insights.

Built specifically for hackathon demonstration with a clean, decoupled architecture ready to connect to a FastAPI backend.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom enterprise design token palette)
- **Routing**: React Router DOM (v6 HashRouter for reliable SPA deployment)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Pie/Donut, Bar, Multi-series Area, Confidence Band Trends)
- **Service Layer**: Configurable REST API abstraction (`src/services/api.js`)
- **State Management**: Reactive React Context (`InventoryContext`) with real-time stock and ledger synchronization

---

## 📁 Project Architecture & Folder Structure

```
stocksense/
├── .env                              # Active environment configuration
├── .env.example                      # Reference template for environment variables
├── index.html                        # Application entry point with typography
├── package.json                      # Project dependencies & scripts
├── postcss.config.js                 # PostCSS setup for Tailwind CSS
├── tailwind.config.js                # Design tokens, palette, and subtle shadows
├── vite.config.js                    # Vite bundler configuration
│
└── src/
    ├── main.jsx                      # React root initialization
    ├── App.jsx                       # Routing setup across all 9 pages & auth guards
    ├── index.css                     # Tailwind directives and custom scrollbar
    │
    ├── context/
    │   ├── AuthContext.jsx           # User session, login/signup & OTP reset state
    │   └── InventoryContext.jsx      # Dynamic multi-store state engine & ledger link
    │
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx             # User login with instant demo access
    │   │   ├── Signup.jsx            # Account registration
    │   │   └── ForgotPassword.jsx    # Multi-step 6-digit OTP verification & reset
    │   ├── Dashboard.jsx             # Executive inventory dashboard
    │   ├── Products.jsx              # Product catalog
    │   ├── Receipts.jsx              # Inbound PO receipts
    │   ├── Deliveries.jsx            # Outbound dispatches
    │   ├── Transfers.jsx             # Inter-facility transfers
    │   ├── Adjustments.jsx           # Stock reconciliation audits
    │   ├── StockLedger.jsx           # Perpetual stock ledger
    │   ├── Warehouses.jsx            # Facilities & capacity tracking
    │   └── AIInsights.jsx            # AI demand forecasting & anomalies
    │
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.jsx         # Shell with responsive sidebar & notification toast
    │   │   ├── Sidebar.jsx           # Nav menu with badges & live backend status
    │   │   └── Navbar.jsx            # Header with facility selector, alerts & user menu

    │   │
    │   ├── common/
    │   │   ├── KPICard.jsx           # Metric card with trends and color badges
    │   │   ├── StatusBadge.jsx       # Universal semantic badge (emerald, amber, rose, indigo)
    │   │   ├── SearchBar.jsx         # Clean search input with clear trigger
    │   │   ├── FilterDropdown.jsx    # Reusable select dropdown
    │   │   ├── Modal.jsx             # Accessible backdrop & dialog container
    │   │   ├── AlertBanner.jsx       # Dismissible status notification banners
    │   │   ├── EmptyState.jsx        # Illustrated empty data fallback
    │   │   ├── LoadingState.jsx      # Animated spinner with sync indicators
    │   │   └── Pagination.jsx        # Data pagination with range indicator
    │   │
    │   ├── tables/
    │   │   └── DataTable.jsx         # Sortable, paginated enterprise data table
    │   │
    │   ├── charts/
    │   │   ├── ChartCard.jsx         # Standard chart wrapper with actions
    │   │   ├── StockByCategoryChart.jsx   # Donut breakdown by product category
    │   │   ├── StockByWarehouseChart.jsx  # Warehouse capacity comparison
    │   │   ├── InventoryMovementChart.jsx # Weekly receipts vs deliveries vs transfers
    │   │   └── DemandTrendChart.jsx       # Actual vs predicted demand + 95% band
    │   │
    │   └── modals/
    │       ├── ProductModal.jsx      # Add / Edit product specifications
    │       ├── ReceiptModal.jsx      # Log inbound supplier PO receipts
    │       ├── DeliveryModal.jsx     # Dispatch customer sales deliveries
    │       ├── TransferModal.jsx     # Schedule inter-warehouse stock rebalancing
    │       ├── AdjustmentModal.jsx   # Cycle count audit (Physical - Recorded)
    │       └── WarehouseModal.jsx    # Register / Edit warehouse facilities
    │
    ├── context/
    │   └── InventoryContext.jsx      # Dynamic multi-store state engine & ledger link
    │
    ├── data/
    │   ├── products.js               # 15+ rich inventory items across 6 categories
    │   ├── receipts.js               # PO purchase receipts data
    │   ├── deliveries.js             # Outbound sales dispatches data
    │   ├── transfers.js              # Inter-facility transit logs
    │   ├── adjustments.js            # Stock reconciliation history
    │   ├── ledger.js                 # Immutable transaction movements
    │   ├── warehouses.js             # 5 major distribution centers
    │   └── insights.js               # AI simulated demand forecast & anomalies
    │
    ├── hooks/
    │   └── useInventory.js           # Custom hook for easy context consumption
    │
    ├── services/
    │   └── api.js                    # REST Service Layer with mock fallback
    │
    └── utils/
        └── formatters.js             # Currency, numbers, and date helpers
```

---

## 🛠️ Installation & Running Locally

### 1. Prerequisites
- Node.js (v18 or newer recommended, tested on v24)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 4. Create Production Build
```bash
npm run build
```
Build output is generated in the `dist/` directory.

---

## 🔌 FastAPI Backend Integration Guide

StockSense was architected with a decoupled service layer specifically designed for drop-in FastAPI REST API integration.

### 1. Environment Variable Configuration
Edit `.env` (or copy from `.env.example`):
```env
# Backend Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Switch to false to route requests to the live FastAPI backend
VITE_USE_MOCK_DATA=false
```

### 2. Endpoints Contract Ready in `src/services/api.js`

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List all catalog products |
| `POST` | `/products` | Create a new product |
| `PUT` | `/products/:id` | Update product details / stock |
| `DELETE` | `/products/:id` | Delete a product |
| `GET` | `/receipts` | List inbound purchase order receipts |
| `POST` | `/receipts` | Record an inbound receipt |
| `GET` | `/deliveries` | List outbound customer deliveries |
| `POST` | `/deliveries` | Dispatch an outbound delivery |
| `GET` | `/transfers` | List inter-facility transfers |
| `POST` | `/transfers` | Schedule a transfer |
| `GET` | `/adjustments` | List stock reconciliation adjustments |
| `POST` | `/adjustments` | Log a physical stock adjustment |
| `GET` | `/ledger` | Get immutable chronological stock movements |
| `GET` | `/warehouses` | List warehouse facilities & capacities |
| `POST` | `/warehouses` | Register a new warehouse |
| `PUT` | `/warehouses/:id` | Update warehouse properties |
| `DELETE` | `/warehouses/:id` | Decommission a warehouse |
| `GET` | `/ai-insights` | Ingest ML forecast, anomaly detection, & prescriptive actions |

### 3. Files to Modify When Connecting to FastAPI
- **`.env`**: Set `VITE_USE_MOCK_DATA=false` and verify `VITE_API_BASE_URL`.
- **`src/services/api.js`**:
  - The `request()` helper already formats headers and error handling.
  - No changes to UI components or pages are needed — components interface only through `api.*` methods or the `useInventory` hook!
