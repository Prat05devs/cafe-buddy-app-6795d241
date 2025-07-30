# Restaurant POS System

A modern, full-stack restaurant point-of-sale system built with Next.js, Node.js, Express, and Supabase PostgreSQL.

## 🚀 Features

- **📱 Modern Dashboard**: Real-time analytics and business insights
- **🍽️ Menu Management**: Complete CRUD operations for menu items and categories
- **📋 Order Processing**: Full order lifecycle from creation to completion
- **🪑 Table Management**: Table status tracking and QR code generation
- **👥 User Management**: Role-based access control (Admin, Manager, Staff)
- **📊 Reports**: Sales analytics and performance metrics
- **🎨 Modern UI**: Glassmorphic design with dark/light mode support
- **🔐 Authentication**: JWT-based security with persistent sessions

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand + TanStack Query
- **Authentication**: JWT with persistent auth store

### Backend (Node.js + Express)
- **API**: RESTful with `/api/v1` prefix
- **Architecture**: Clean architecture (controllers, services, models)
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Security**: Helmet, CORS, rate limiting, JWT auth

## 📁 Project Structure

```
restaurant-pos/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities & API clients
│   │   └── styles/     # Global styles
├── backend/            # Express API server
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── services/   # Business logic
│   │   ├── models/     # Database schemas
│   │   ├── routes/     # API routes
│   │   └── middleware/ # Express middleware
├── shared/             # Shared types & constants
└── docs/              # Documentation
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm 8+
- Supabase account and project
- Git

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd restaurant-pos
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Add your Supabase DATABASE_URL and JWT_SECRET
   
   # Frontend environment (if needed)
   cp frontend/.env.local.example frontend/.env.local
   ```

3. **Database Setup**
   ```bash
   cd backend
   npm run db:generate  # Generate migrations
   npm run db:push      # Push to database
   ```

4. **Start Development**
   ```bash
   npm run dev  # Starts both frontend and backend
   ```

   Or separately:
   ```bash
   npm run dev:backend   # Backend on http://localhost:3001
   npm run dev:frontend  # Frontend on http://localhost:3000
   ```

## 🗄️ Database Schema

### Core Tables
- **users**: Authentication and user management
- **categories**: Menu categorization
- **menu_items**: Restaurant menu with pricing and details
- **tables**: Table management and status tracking
- **orders**: Order processing and tracking
- **order_items**: Individual order line items

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/logout` - User logout

### Menu Management
- `GET /api/v1/menu/categories` - List categories
- `POST /api/v1/menu/categories` - Create category
- `GET /api/v1/menu/items` - List menu items
- `POST /api/v1/menu/items` - Create menu item

### Order Management
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id/status` - Update order status

### Table Management
- `GET /api/v1/tables` - List tables
- `POST /api/v1/tables` - Create table
- `PATCH /api/v1/tables/:id/status` - Update table status

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
# Backend (.env)
DATABASE_URL=your_supabase_postgres_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=3001

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@yourrestaurant.com or create an issue in this repository.

---

Built with ❤️ for the restaurant industry