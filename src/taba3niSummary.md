# 🥛 Taba3ni Dairy Management System - Project Documentation

## 📋 Project Overview

**Project Name:** Taba3ni Dairy Management System  
**Type:** Full-Stack Web Application (React + TypeScript)  
**Industry:** Dairy Products Distribution & Management  
**Location:** Tunisia (TND currency)  

### Purpose
A comprehensive business management system for a dairy company that handles:
- Product inventory management
- Client relationship management
- Order processing and tracking
- Delivery management
- Distributor coordination
- Invoicing and payments
- Analytics and reporting

---

## 👥 User Roles & Permissions

### 1. **Admin Role**
- Full access to all features
- Can manage products, clients, distributors
- Create and manage orders for any client
- View all analytics and reports
- Generate and manage invoices
- Track deliveries

### 2. **Client Role**
- View their own orders only
- **Place new orders** (recently implemented)
- Track order status
- View delivery information
- Access their invoices and payment history
- View their account details

### 3. **Distributor Role** (mentioned in code)
- Delivery management access
- Order fulfillment tracking
- Route optimization

---

## 🏗️ System Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Styled Components
- **State Management:** React Context API
- **Icons:** React Icons (HeroIcons)
- **Build Tool:** Vite

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── OrderForm.tsx    # Order creation/editing (role-aware)
│   ├── ProductForm.tsx  # Product management
│   ├── ClientForm.tsx   # Client management
│   ├── InvoiceForm.tsx  # Invoice generation
│   ├── NotificationToast.tsx    # Toast notifications
│   └── NotificationsPanel.tsx   # Notification dropdown
│
├── pages/               # Main application pages
│   ├── Dashboard.tsx    # Overview & statistics
│   ├── Orders.tsx       # Order management (role-aware)
│   ├── OrderDetails.tsx # Individual order view
│   ├── Products.tsx     # Product catalog
│   ├── Clients.tsx      # Client management
│   ├── ClientDetails.tsx
│   ├── Deliveries.tsx   # Delivery tracking
│   ├── DeliveryDetails.tsx
│   ├── Distributors.tsx # Distributor management
│   ├── DistributorDetails.tsx
│   ├── Invoices.tsx     # Invoice & payment management
│   ├── InvoiceDetails.tsx
│   ├── Analytics.tsx    # Business analytics
│   └── Login.tsx        # Authentication
│
├── hooks/               # Custom React hooks
│   └── useNotifications.tsx  # Notification system
│
├── UI/                  # Base UI components
│   ├── AppLayout.tsx    # Main app layout with sidebar
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── StatusBadge.tsx
│   └── ...more
│
├── styles/              # Global styles
│   └── GlobalStyles.tsx
│
├── utils/               # Utility functions
│   └── statusHelpers.ts
│
└── types/               # TypeScript type definitions
    └── status.ts
```

---

## ✨ Features Implemented

### 1. **Authentication System**
- Login page with role-based access
- Session persistence using localStorage
- Global window.login() and window.logout() functions
- Protected routes based on authentication status

### 2. **Dashboard** 
- Quick statistics overview
- Recent activity feed
- Key performance indicators (KPIs)
- Role-specific dashboard views

### 3. **Order Management System** ⭐ (Recently Enhanced)
**Admin Features:**
- Create orders for any client
- Edit existing orders
- Delete orders
- View all orders with filters
- Search by order ID or client name
- Track order status (pending, processing, delivered, failed)
- Track payment status (paid, unpaid, partial)

**Client Features:** (NEW)
- Place new orders independently
- Select products with quantity controls
- See real-time price calculations
- Set delivery date and address
- View order summary before submission
- View only their own orders
- Track order status

**Order Form Features:**
- Dynamic product selection dropdown
- Quantity controls with +/- buttons
- Stock validation
- Real-time subtotal calculation
- Tax calculation (19% TVA)
- Total amount display
- Delivery information
- Optional notes field
- Role-aware UI (different fields for admin vs client)

### 4. **Product Management**
- Product catalog with grid view
- Add/Edit/Delete products
- Product details:
  - Name, Category, SKU
  - Price and Unit (1L, 500g, etc.)
  - Current stock and minimum stock levels
  - Product descriptions
- Stock level indicators (low, medium, high)
- Auto-generate SKU codes
- Stock warnings
- Category filtering
- Search by name or SKU

**Product Categories:**
- Milk
- Yogurt
- Cheese
- Butter
- Cream
- Dairy (general)

### 5. **Client Management**
- Client database with detailed profiles
- Client types: Supermarket, Grocery, Restaurant, Cafe, Other
- Client information:
  - Contact details (name, phone, email)
  - Address and city
  - Contact person
  - Tax ID
  - Payment terms
- Financial tracking:
  - Total orders and revenue
  - Credit limit management
  - Current balance
  - Outstanding payments
- Client status (active, inactive, pending)
- Order history per client
- Client statistics and analytics
- Quick actions (create order, view invoices)

### 6. **Invoice & Payment Management** ⭐ (Enhanced with Notifications)
- Generate invoices from orders
- Invoice details:
  - Invoice number (auto-generated)
  - Client information
  - Linked order ID
  - Itemized product list
  - Amount, paid amount, balance
  - Issue date and due date
  - Payment status
- Payment status tracking (paid, unpaid, partial, overdue)
- Overdue invoice detection
- Invoice actions:
  - **View invoice details** (with notification)
  - **Download PDF** (with progress notification)
  - **Send payment reminders** (with confirmation notification)
- Invoice statistics:
  - Total invoices
  - Total amount
  - Paid amount
  - Outstanding balance
  - Overdue count
- Filter by payment status
- Search by invoice number or client

### 7. **Notification System** 🔔 (Recently Implemented)
**Two-Layer System:**
1. **Toast Notifications** (Temporary popups)
   - Auto-dismiss after duration
   - Slide-in animation from right
   - Color-coded by type (success, error, warning, info)
   - Close button for manual dismiss

2. **Notification Panel** (Persistent dropdown)
   - Bell icon in header with unread count badge
   - Dropdown panel with all notifications
   - Notifications persist until manually cleared
   - Shows timestamp (relative: "5m ago", "2h ago")
   - Mark as read/unread
   - Mark all as read
   - Clear all notifications
   - Delete individual notifications

**Notification Types:**
- Success (green): Order placed, invoice paid, etc.
- Error (red): Failed operations, validation errors
- Warning (yellow): Stock alerts, payment reminders
- Info (blue): Status updates, loading states

**Currently Implemented Notifications:**
- Order placement confirmation
- Invoice viewing
- Invoice download progress & completion
- Payment reminder sending & confirmation
- Form validation errors
- General success/error messages

### 8. **Delivery Management**
- Delivery tracking system
- Delivery routes
- Distributor assignment
- Delivery status tracking
- Delivery details page

### 9. **Distributor Management**
- Distributor profiles
- Performance tracking
- Order assignment
- Delivery statistics

### 10. **Analytics & Reports**
- Sales analytics
- Revenue tracking
- Product performance
- Client analytics
- Payment tracking

### 11. **UI/UX Features**
- Responsive design (desktop, tablet, mobile)
- Dark mode support (infrastructure ready)
- Loading states
- Empty states with helpful messages
- Error boundaries
- Confirmation dialogs for destructive actions
- Context menus (three-dot menus)
- Modal dialogs
- Search bars with real-time filtering
- Filter buttons for quick access
- Status badges with color coding
- Timeline components for tracking
- Statistics cards with icons

---

## 🎨 Design System

### Color Palette
- **Primary (Brand):** Blue tones for main actions
- **Success:** Green (#10b981) for positive actions
- **Error:** Red (#ef4444) for destructive actions
- **Warning:** Yellow (#f59e0b) for alerts
- **Info:** Blue (#3b82f6) for information
- **Grey Scale:** 0-900 for text and backgrounds

### Typography
- **Headings:** Bold, hierarchical (h1, h2, h3)
- **Body:** 1.4rem-1.6rem
- **Small Text:** 1.2rem-1.3rem
- **Font:** System fonts for performance

### Components
- Rounded corners (border-radius-sm, md, lg)
- Consistent spacing (1.2rem, 1.6rem, 2.4rem)
- Shadow system (shadow-sm, md, lg)
- Hover states with transitions
- Focus states for accessibility

---

## 📊 Data Models (Mock Data Structure)

### Order
```typescript
{
  id: string
  orderNumber: string (e.g., "ORD-001")
  clientId: string
  client: string (client name)
  products: Product[]
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  date: string (ISO date)
  deliveryDate: string
  deliveryAddress?: string
  notes?: string
}
```

### Product
```typescript
{
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  unit: string (e.g., "1L", "500g")
  sku: string (e.g., "MLK-001")
  description?: string
}
```

### Client
```typescript
{
  id: string
  name: string
  type: ClientType (supermarket, grocery, restaurant, cafe, other)
  status: ClientStatus (active, inactive, pending)
  phone: string
  email: string
  address: string
  city: string
  contactPerson: string
  taxId?: string
  paymentTerms: string
  totalOrders: number
  totalSpent: number
  creditLimit: number
  balance: number
}
```

### Invoice
```typescript
{
  id: string
  invoiceNumber: string (e.g., "INV-2025-001")
  client: { name: string, email: string }
  orderId: string
  amount: number
  paidAmount: number
  status: PaymentStatus (paid, unpaid, partial, overdue)
  issueDate: string
  dueDate: string
  paymentDate?: string
}
```

### Notification
```typescript
{
  id: string
  title: string
  message: string
  type: NotificationType (success, error, warning, info)
  timestamp: Date
  read: boolean
  showToast: boolean (for popup display)
  persistent: boolean (for panel storage)
  action?: {
    label: string
    onClick: () => void
  }
}
```

---

## 🔄 Current State & Recent Work

### Latest Implementations (This Session):

1. **✅ Notification System** (Complete)
   - Dual-layer system (toast + panel)
   - Persistent notifications in dropdown
   - Toast auto-dismiss functionality
   - Integration with invoice actions
   - Context API for global state

2. **✅ Client Order Placement** (Complete)
   - Enhanced OrderForm to support client role
   - Role-aware UI (different fields per role)
   - Stock validation for clients
   - Delivery address field for clients
   - Order submission with notifications

3. **✅ Role-Based Access Control**
   - Orders page shows different content per role
   - Clients see "My Orders" instead of "Orders Management"
   - Admins can edit/delete, clients can only view
   - Different stats displayed per role

---

## 🚀 Next Steps / TODO

### Potential Enhancements:
1. **Backend Integration**
   - Replace mock data with real API calls
   - Authentication with JWT tokens
   - Database integration
   - File upload for invoices/documents

2. **Advanced Features**
   - Email notifications for invoices
   - SMS notifications for deliveries
   - PDF generation for invoices
   - Export data to Excel/CSV
   - Advanced analytics with charts
   - Real-time order tracking with maps
   - Batch operations (bulk orders, bulk invoices)

3. **Product Features**
   - Product images
   - Product variants (sizes, flavors)
   - Batch/lot tracking
   - Expiry date management
   - Barcode scanning

4. **Payment Integration**
   - Payment gateway integration
   - Online payment options
   - Payment receipts
   - Refund management

5. **Performance**
   - Pagination for large datasets
   - Virtual scrolling for tables
   - Image optimization
   - Code splitting
   - Lazy loading

---

## 🐛 Known Issues / Bugs Fixed

### Recently Fixed:
- ✅ Missing import for `Row` component in Orders.tsx
- ✅ Notifications disappearing from dropdown panel
- ✅ Toast notifications not showing for invoice actions

### Current Limitations:
- Using localStorage (no database)
- Mock data (no real backend)
- No user registration flow
- No password recovery
- No multi-language support
- No PDF generation (console logs only)
- No email sending (simulated with timeouts)

---

## 📝 How to Use This Documentation

**If you lose the conversation, tell the AI:**

> "I'm working on the Taba3ni Dairy Management System - a React TypeScript app for dairy product distribution in Tunisia. It has role-based access (admin/client), order management, invoicing, and a notification system. We just implemented client order placement and enhanced the notification system with persistent dropdowns. The latest code has OrderForm supporting both admin and client modes, and Orders page with role-based UI. Can you help me continue from where we left off?"

**Key files to mention:**
- `src/components/OrderForm.tsx` - Enhanced for role support
- `src/pages/Orders.tsx` - Role-based order management
- `src/hooks/useNotifications.tsx` - Dual-layer notification system
- `src/components/NotificationToast.tsx` - Toast popups
- `src/components/NotificationsPanel.tsx` - Persistent dropdown
- `src/pages/Invoices.tsx` - Invoice management with notifications

**Technologies:**
React 18, TypeScript, Styled Components, React Router, Context API, Vite

---

## 💡 Key Concepts Used

- **Component Composition:** Reusable UI components
- **Render Props:** Modal and Menus patterns
- **Context API:** Global notification state
- **Custom Hooks:** useNotifications for notification management
- **TypeScript:** Full type safety
- **Styled Components:** CSS-in-JS with props
- **Protected Routes:** Role-based routing
- **Form Handling:** Controlled components
- **State Management:** Local state + Context
- **Mock Data:** Simulating backend responses

---

## 📈 Project Statistics

- **Pages:** 15+ main pages
- **Components:** 30+ reusable components
- **Features:** 11 major feature areas
- **User Roles:** 3 (Admin, Client, Distributor)
- **Lines of Code:** ~5000+ (estimated)
- **Development Time:** Multiple sessions
- **Status:** Active development

---

**Last Updated:** December 10, 2025  
**Version:** 1.0 (Development)  
**Developer:** Working with Claude AI Assistant