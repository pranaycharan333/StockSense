# StockSense — Modern Enterprise Inventory Management System

StockSense is an enterprise-grade, responsive platform for inventory tracking, multi-warehouse logistics, cycle count adjustments, perpetual stock ledger auditing, AI predictive insights, and secure user authentication with OTP-based password reset.

---

## 🚀 Tech Stack

### Frontend:
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom enterprise design token palette)
- **Routing**: React Router DOM (v6 HashRouter with Protected Routes)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Pie/Donut, Bar, Multi-series Area, Confidence Band Trends)
- **Service Layer**: Configurable REST API abstraction (`src/services/api.js`)
- **State Management**: Reactive React Context (`AuthContext` + `InventoryContext`) with real-time stock and ledger synchronization

### Database & Backend Ready:
- MySQL 8.0+ schema with automated triggers, stored procedures, indexed views, and seed data.
- Machine Learning demand forecasting pipeline (`train_model.py`, `predict.py`, `inventory_model.pkl`).
- REST endpoints configured for FastAPI connection.

---

## 🔐 Authentication & Security Flows

- **User Sign In (`/login`)**:
  - Secure authentication with work email & password
  - "Remember Me" device preference
  - Quick-Access One-Click Demo Login for immediate hackathon evaluation
  - Automatic redirection to the Inventory Dashboard upon successful sign-in
- **User Registration (`/signup`)**:
  - Enterprise account onboarding (Name, Email, Company, Role, Department)
  - Validation with instant dashboard redirection
- **OTP-Based Password Reset (`/forgot-password`)**:
  - **Step 1**: Account email identification & 6-digit OTP generation
  - **Step 2**: 6-digit OTP verification with countdown timer and resend capability
  - **Step 3**: New password configuration with password matching validation
  - **Step 4**: Immediate automated session launch and redirection to the Inventory Dashboard
- **Session Management**:
  - Protected route guard (`ProtectedRoute`)
  - User profile menu in top navigation bar with full profile info and Sign Out action

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
├── schema.sql                        # MySQL database schema
├── indexes.sql                       # Database performance indexes
├── views.sql                         # Materialized inventory and KPI views
├── procedures.sql                    # Stored procedures for audit and reconciliation
├── triggers.sql                      # Automated ledger & alert triggers
├── seed.sql                          # Initial seed dataset
├── train_model.py                    # ML model training pipeline
├── predict.py                        # ML inference script
├── requirements.txt                  # Python dependencies
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
    │   ├── useAuth.js                # Hook for auth session & OTP actions
    │   └── useInventory.js           # Hook for inventory state & actions
    │
    ├── services/
    │   └── api.js                    # REST Service Layer with mock fallback
    │
    └── utils/
        └── formatters.js             # Currency, numbers, and date helpers
```

---

## 🛠️ Installation & Running Frontend Locally

### 1. Install Dependencies
```powershell
cd stocksense
npm install
```

### 2. Run Development Server
```powershell
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 3. Build for Production
```powershell
npm run build
```

---

## 🗄️ Database Setup Instructions

Run database migration scripts in this order:

```bash
mysql -u root -p < schema.sql
mysql -u root -p stocksense_db < indexes.sql
mysql -u root -p stocksense_db < views.sql
mysql -u root -p stocksense_db < procedures.sql
mysql -u root -p stocksense_db < triggers.sql
mysql -u root -p stocksense_db < seed.sql
```

Useful database diagnostic queries:
```sql
CALL sp_get_dashboard_kpis();
SELECT * FROM v_inventory_status;
SELECT * FROM v_low_stock_items;
SELECT * FROM v_stock_movement;
```

---

## 🔌 Connecting to FastAPI Backend

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_DATA=false
```
All endpoints (`/auth/login`, `/auth/signup`, `/auth/otp/send`, `/auth/password/reset`, `/products`, `/receipts`, `/deliveries`, `/transfers`, `/adjustments`, `/ledger`, `/warehouses`, `/ai-insights`) are configured in `src/services/api.js`.
