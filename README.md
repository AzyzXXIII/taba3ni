# 🥛 Taba3ni Dairy Management System

> **Full-Stack React + TypeScript web application for dairy product distribution management in Tunisia.**  
> Built with role-based access control for Admin, Distributor, and Client users.

---

## 🚀 Quick Start (Resuming Development)

If you're returning to this project after a break, tell Claude:

> *"I'm working on the Taba3ni Dairy Management System — a React TypeScript app for dairy distribution in Tunisia. It has 3 roles (admin/distributor/client), full order management, delivery tracking with live maps, invoicing, notifications, history, and profile pages. Check the README.md for the full picture and let's continue."*

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Styled Components |
| State | React Context API |
| Icons | React Icons (HeroIcons `hi2`) |
| Build | Vite |
| Currency | TND (Tunisian Dinar) |

---

## 👥 Roles & Access

### Admin
Full access to everything. Manages the entire operation.

### Distributor
- Sees only their assigned deliveries and orders
- Has their own delivery history with personal stats
- Profile with vehicle info, zones, performance metrics

### Client
- Sees only their own orders and invoices
- Can place new orders via multi-step flow
- Live delivery tracking when order is out for delivery
- Profile with store info, editable contact fields

---

## 🗂️ Project Structure

```
src/
├── App.tsx                          ← Route definitions (ALL routes here)
├── pages/
│   ├── Dashboard.tsx                ← Role-aware dashboard (3 variants)
│   ├── Login.tsx                    ← Auth page with demo credentials
│   ├── Orders.tsx                   ← Order list (role-filtered)
│   ├── OrderDetails.tsx             ← Order detail + live tracking for client
│   ├── NewOrder.tsx                 ← 4-step new order flow (client)
│   ├── Deliveries.tsx               ← Delivery list (role-filtered)
│   ├── DeliveryDetails.tsx          ← Full delivery detail + map
│   ├── DeliveryHistory.tsx          ← ✅ NEW — History for all roles
│   ├── Invoices.tsx                 ← Role-split: admin mgmt / client read-only
│   ├── InvoiceDetails.tsx           ← Role-aware invoice detail
│   ├── Products.tsx                 ← Product catalog (admin only)
│   ├── Clients.tsx                  ← Client management (admin only)
│   ├── ClientDetails.tsx
│   ├── Distributors.tsx             ← Distributor management (admin only)
│   ├── DistributorDetails.tsx
│   ├── Analytics.tsx                ← Charts + KPIs (admin only, blocked for others)
│   ├── Profile.tsx                  ← ✅ NEW — Role-aware profile + settings tab
│   └── PageNotFound.tsx
├── components/
│   ├── OrderForm.tsx                ← Role-aware order creation/editing
│   ├── DeliveryForm.tsx
│   ├── DeliveryConfirmation.tsx
│   ├── DeliveryMap.tsx              ← Live map component (reused in tracking)
│   ├── InvoiceForm.tsx
│   ├── NotificationToast.tsx        ← Toast popups (auto-dismiss)
│   └── NotificationsPanel.tsx       ← Bell icon dropdown (persistent)
├── UI/
│   ├── AppLayout.tsx                ← Sidebar + header shell
│   ├── MainNav.tsx                  ← ✅ UPDATED — Role nav with sections/dividers
│   ├── Button.tsx
│   ├── Modal.tsx                    ← Compound component pattern
│   ├── Menus.tsx                    ← Context menu (3-dot)
│   ├── StatusBadge.tsx
│   ├── StatsCard.tsx
│   ├── Timeline.tsx
│   ├── SearchBar.tsx
│   └── ...more UI primitives
├── hooks/
│   └── useNotifications.tsx         ← Global notification context
├── utils/
│   └── statusHelpers.ts             ← getStatusDisplay() for badges
└── types/
    └── status.ts                    ← OrderStatus, PaymentStatus types
```

---

## 🗺️ All Routes (App.tsx)

All protected routes live inside the `<AppLayout>` wrapper — this is what gives every page the sidebar nav.

```
/login                     → Login page (public)
/dashboard                 → Role-aware dashboard
/orders                    → Order list (role-filtered)
/orders/:orderId           → Order detail + client tracking
/new-order                 → 4-step new order (client)
/deliveries                → Delivery list (role-filtered)
/deliveryDetails/:id       → Full delivery detail
/deliveries/new            → Schedule delivery form
/history                   → Delivery/order history (all roles)
/profile                   → Profile + settings (all roles)
/invoices                  → Invoice list (role-split)
/invoices/:invoiceId       → Invoice detail (role-aware)
/products                  → Product catalog (admin)
/clients                   → Client list (admin)
/clients/:clientId         → Client detail (admin)
/distributors              → Distributor list (admin)
/distributors/:id          → Distributor detail (admin)
/analytics                 → Analytics (admin, blocked for others)
```

**Critical:** Every route under `<AppLayout>` must be nested inside the protected `<Route element={<AppLayout .../>}>` block or the sidebar won't render.

---

## ✅ Completed Features

### Authentication
- Login with role-based demo credentials
- Session persisted in `localStorage`
- `window.login()` / `window.logout()` for programmatic auth
- Protected routes redirect to `/login` if not authenticated

### Dashboard (Phase 1)
- **Admin:** KPI cards, revenue chart, recent orders table, alerts
- **Distributor:** Today's deliveries, route summary, completion stats
- **Client:** Order status summary, active deliveries, quick actions

### Orders
- Full CRUD for admin
- Role-filtered lists (client sees own, distributor sees assigned)
- Status update modal (admin + distributor)
- Client can cancel pending orders only
- CSV export, date range filter, search, status tabs
- Distributor column with avatar initials

### New Order (4-Step Flow — Client)
- **Step 1:** Product grid with category tabs, cart sidebar, stock guard
- **Step 2:** Delivery details — address, city, date, speed, payment method
- **Step 3:** Full review — products table, pricing breakdown
- **Step 4:** Success screen with generated order ID + notification
- "Track My Order" button → `/orders`

### Deliveries
- Role-filtered (client = own deliveries, distributor = assigned)
- CSV export, date range, status filter
- Schedule Delivery modal (admin only)
- Mobile card view

### DeliveryDetails
- Progress bar (Scheduled → En Route → At Location → Delivered)
- Live map (`DeliveryMap` component) with distributor + client pins
- Driver notes, delivery timeline
- Proof of delivery (signature + photos) for completed
- Admin: Edit, Cancel, Mark as Delivered, Report Issue modals

### OrderDetails (Role-Aware)
- **Client out-for-delivery:** Full `LiveTrackingSection` with animated progress steps, ETA badge, driver info strip, call/message links, embedded DeliveryMap, delivery timeline
- **Client pending/processing:** Status hint banner
- **Client delivered:** Green success banner
- **Admin:** Edit + Delete buttons, "View in Deliveries" link
- Client blocked from other clients' orders (🔒 screen)

### Invoices (Role-Split)
- **Admin:** 5 KPI stats, full table, record payment modal, send reminder, CSV export, generate invoice button
- **Client:** Personal summary box, overdue/unpaid alert banners, card-based list, Pay Now button, contact footer
- **InvoiceDetails:** Payment progress bar, payment history, timeline; client blocked from other clients' invoices

### Notifications (Dual-Layer)
- **Toast:** Auto-dismiss, slide-in animation, color-coded by type
- **Panel:** Bell icon in header, unread count badge, mark read/unread, clear all, timestamps
- Types: `success`, `error`, `warning`, `info`
- `persistent: true` flag keeps notification in panel after toast dismisses

### Delivery History (Phase 3)
- All 3 roles, each filtered to their own data
- **Admin:** Full table with View button, all distributors/clients visible
- **Distributor:** Personal table + Performance Overview grid (total km, avg delivery time, success rate, avg rating with stars, total TND delivered)
- **Client:** Card table with **Reorder** button on completed entries → navigates to `/new-order`
- Stats cards adapt per role (distributor gets distance + rating, client gets total spent)
- CSV export, date range filter, status filter, search

### Profile (Phase 3)
All 3 roles have Profile + Settings tabs.

**Editable vs Locked:**

| Field | Admin | Distributor | Client |
|---|---|---|---|
| Name | 🔒 Admin only | 🔒 Admin only | 🔒 Admin only |
| Email | 🔒 Admin only | 🔒 Admin only | 🔒 Admin only |
| Phone | ✏️ Editable | ✏️ Editable | ✏️ Editable |
| Department | 🔒 Admin only | — | — |
| Emergency Contact | — | ✏️ Editable | — |
| Contact Person | — | — | ✏️ Editable |
| Vehicle / Zones / Tax ID | — | 🔒 Admin only | 🔒 Admin only |

Locked fields show "Admin only" badge. Editable fields show inline Edit → input with save (Enter/✓) and cancel (Escape/✗). Success notification fires on save.

**Distributor profile extras:** Performance stats grid (6 tiles), vehicle card, assigned zones tags.  
**Client profile extras:** Account summary stats, account manager card, quick action buttons.

**Settings tab (all roles):**
- Email + SMS notification toggles
- Dark mode toggle
- Language selector (EN / FR / AR)
- Timezone selector
- Change Password + Enable 2FA buttons

### Navigation (MainNav)
Role-specific navs with section labels and dividers:
- **Admin:** Dashboard → Operations (Orders, Deliveries, History, Invoices) → Management (Clients, Distributors, Products) → Analytics, Profile, Settings
- **Distributor:** Dashboard, Today's Deliveries, My Orders, History, My Profile
- **Client:** Dashboard → Orders (New Order, My Orders, Order History) → Invoices & Payments → My Account, Settings

---

## 🔑 Demo Login Credentials

These are hardcoded in `Login.tsx`. Check the file for the exact email/password pairs, but the roles are:

| Role | Email pattern |
|---|---|
| Admin | `admin@taba3ni.tn` |
| Distributor | `ahmed.mahmoudi@taba3ni.tn` |
| Client | `client@taba3ni.tn` |

Mock data across all pages uses these emails as `clientId` / `distributorId` for role filtering to work correctly.

---

## 🧩 Key Patterns

### Role-Based Filtering
Every page that shows data filters by `userId` (the logged-in user's email):
```tsx
// In Orders.tsx, Deliveries.tsx, History.tsx etc.
const roleFiltered = mockData.filter(item => {
  if (userRole === "client")      return item.clientId === userId;
  if (userRole === "distributor") return item.distributorId === userId;
  return true; // admin sees all
});
```

### Role Props Pattern
Pages receive `userRole`, `userId`, `userName` from `App.tsx`:
```tsx
<Route path="orders" element={
  <Orders userRole={user?.role} userId={user?.email} userName={user?.name} />
} />
```

### Root Switcher Pattern (Invoices, Dashboard)
```tsx
function Invoices({ userRole, userId }) {
  if (userRole === "client") return <ClientInvoices userId={userId} />;
  return <AdminInvoices />;
}
```

### Notification System
```tsx
const { addNotification } = useNotifications();
addNotification("Title", "Message body", "success", { duration: 4000, persistent: true });
```

### Modal + Menus Compound Components
```tsx
<Modal>
  <Modal.Open opens="my-modal">
    <Button>Open</Button>
  </Modal.Open>
  <Modal.Window name="my-modal">
    <MyForm onCloseModal={() => {}} />
  </Modal.Window>
</Modal>
```

---

## 📊 Mock Data Locations

All data is hardcoded mock arrays. When you move to a real backend, replace these:

| Page | Mock data variable |
|---|---|
| Orders.tsx | `mockOrders` |
| Deliveries.tsx | `mockDeliveries` |
| DeliveryHistory.tsx | `mockHistory` |
| OrderDetails.tsx | `ORDERS_MAP` |
| DeliveryDetails.tsx | `mockDeliveryDetails` |
| Invoices.tsx | `mockInvoices` |
| InvoiceDetails.tsx | lookup from `mockInvoices` |
| Profile.tsx | `PROFILES` |
| Analytics.tsx | inline mock arrays |
| Products.tsx | `mockProducts` |
| Clients.tsx | `mockClients` |
| Distributors.tsx | `mockDistributors` |

**Important:** Mock data `clientId` values must match login email exactly for role filtering. E.g., `clientId: "client@taba3ni.tn"` only shows when logged in as `client@taba3ni.tn`.

---

## 🚧 What's NOT Done Yet (Next Steps)

### High Priority
- [ ] **Settings page** (`/settings`) — currently a dead nav link for admin and client. The Settings tab inside Profile works, but `/settings` as a standalone route doesn't exist yet.
- [ ] **DeliveryDetails role-aware** — currently shows admin actions (Edit, Cancel, Mark Delivered) to all roles. Needs same role-split as OrderDetails.
- [ ] **Distributor orders page** — distributor sees `/orders` but the page was primarily built for admin/client. Status update flow works but UI could be cleaner for distributor.

### Medium Priority
- [ ] **Pagination** — all tables load all mock data at once. Add pagination or virtual scroll for production.
- [ ] **Real PDF generation** — invoice Download PDF currently logs to console. Integrate a library like `react-pdf` or `jsPDF`.
- [ ] **Real email/SMS** — notification sending is simulated with `setTimeout`. Wire to backend.
- [ ] **Product images** — product cards show emoji placeholders.
- [ ] **Analytics real data** — charts use hardcoded numbers, not derived from orders/deliveries.

### Low Priority / Future
- [ ] **Backend integration** — replace all mock data with API calls (REST or GraphQL)
- [ ] **JWT authentication** — replace `localStorage` boolean with proper tokens
- [ ] **Real map integration** — `DeliveryMap` component currently renders a placeholder. Wire to Google Maps or Leaflet with real GPS coordinates
- [ ] **Dark mode** — toggle exists in Settings but doesn't actually apply theme yet (CSS variables infrastructure is ready)
- [ ] **Multi-language** — language selector in Settings exists but i18n not wired
- [ ] **Barcode scanning** for products
- [ ] **Batch operations** — bulk order status update, bulk invoice generation
- [ ] **Payment gateway** integration
- [ ] **User registration flow**
- [ ] **Password recovery**

---

## 🐛 Known Issues

| Issue | Status | Notes |
|---|---|---|
| `/settings` route is a dead link | ⚠️ Open | Nav links to it but no page exists |
| DeliveryDetails doesn't check role | ⚠️ Open | Client can see admin action buttons |
| Dark mode toggle does nothing | ⚠️ Open | UI exists, CSS var switching not wired |
| Map is a placeholder | ⚠️ Open | `DeliveryMap` renders a styled div, not real map |
| All data is mock | ⚠️ Open | No backend, no persistence across sessions |

---

## 🔄 Session-to-Session Development Log

### Phase 1 — Core + Dashboards
- Auth system, protected routes, AppLayout
- Role-aware Dashboard (admin/distributor/client variants)
- Orders with role filtering, status updates
- Products, Clients, Distributors CRUD
- Deliveries + DeliveryDetails with map placeholder
- Notifications dual-layer system (toast + panel)
- Analytics page

### Phase 2 — Client Experience
- **NewOrder** — 4-step flow (product selection → delivery details → review → confirmation)
- **Invoices** role-split — admin full management, client read-only with alert banners
- **InvoiceDetails** role-aware — admin can record payment, client read-only
- **OrderDetails** enhanced — live tracking section for client when `out-for-delivery`
- Fixed "Track Delivery" button to go to `/orders` not `/deliveries` for client

### Phase 3 — Distributor + History + Profile
- **DeliveryHistory** — all 3 roles, filtered data, performance overview for distributor, reorder for client
- **Profile** — role-aware with inline editable fields, locked admin-managed fields, Settings tab
- **MainNav** updated — section labels, dividers, History + Profile added to all roles
- **App.tsx** fixed — `history` and `profile` routes added inside protected layout wrapper
- **OrderDetails** — role props now passed correctly from App.tsx

---

## 💡 Tips for Continuing Development

1. **Always nest new routes inside the protected `<Route element={<AppLayout.../>}>` block in App.tsx** — forgetting this causes the sidebar to disappear.

2. **Pass `userRole`, `userId`, `userName` as props** from App.tsx to every new page that needs role-aware behavior.

3. **Match mock data emails exactly** — if you add new mock entries, `clientId` / `distributorId` must match the demo login email exactly.

4. **Use `addNotification` for user feedback** — import from `useNotifications` hook. Always add `persistent: true` for important actions so they appear in the bell panel.

5. **Reuse existing UI components** — `StatsCard`, `StatusBadge`, `Timeline`, `SearchBar`, `Modal`, `Menus`, `ConfirmDelete` are all ready to use.

6. **Check `statusHelpers.ts`** — `getStatusDisplay(status)` returns `{ label, icon, color }` for any `OrderStatus` or `PaymentStatus`.

---

## 📁 Files to Always Share When Resuming

If resuming with a new Claude session and working on a specific feature, share these files:

| Working on | Share these files |
|---|---|
| Orders / order flow | `Orders.tsx`, `OrderDetails.tsx`, `App.tsx` |
| Deliveries | `Deliveries.tsx`, `DeliveryDetails.tsx` |
| Invoices | `Invoices.tsx`, `InvoiceDetails.tsx` |
| Navigation / routing | `App.tsx`, `MainNav.tsx`, `AppLayout.tsx` |
| Any new page | `App.tsx` (for route context) |
| Notifications | `useNotifications.tsx`, `NotificationToast.tsx` |
| Auth / login | `Login.tsx`, `App.tsx` |

---

*Last updated: Phase 3 complete — History, Profile, Settings tab, all routes fixed*  
*Status: Active development | No backend yet — all mock data*