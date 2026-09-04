# 🛒 E-Commerce Store (ShopHub)

A full-stack e-commerce store with product catalog, shopping cart, and order management.

## ✨ Features

- **User Auth** - Register/login with JWT
- **Product Catalog** - 20+ products, categories, search, filters
- **Shopping Cart** - Add/remove items, quantity updates
- **Checkout** - Address, payment, order confirmation
- **Order Tracking** - Status updates
- **Admin Dashboard** - Manage products & orders
- **Reviews** - Rate and review products

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

## 🚀 Quick Start

```bash
cd backend && npm install && node seed.js && npm start    # Port 5001
cd frontend && npm install && npm run dev                 # Port 5173
```

## 🔑 Demo Accounts

- Admin: `admin@shophub.in` / `admin123`
- Customer: `rahul@example.com` / `customer123`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/admin` | All orders (admin) |

## 👨‍💻 Author

[Pavan Kumar](https://github.com/pavankumar501)