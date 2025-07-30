# Restaurant POS System - Modern Folder Structure Plan

## 🎯 Target Architecture: Full Stack Separation

```
restaurant-pos/
├── frontend/                      # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 13+)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   ├── orders/
│   │   │   ├── tables/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── features/           # Feature-specific components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── menu/
│   │   │   │   ├── orders/
│   │   │   │   ├── tables/
│   │   │   │   └── reports/
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   └── common/             # Common components
│   │   ├── lib/                    # Utilities and configurations
│   │   │   ├── api/                # API client functions
│   │   │   ├── auth/               # Authentication utilities
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── stores/             # State management (Zustand/Redux)
│   │   │   ├── utils.ts
│   │   │   ├── constants.ts
│   │   │   └── validations.ts
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── styles/                 # Global styles and themes
│   │   └── middleware.ts           # Next.js middleware
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                       # Node.js + Express API
│   ├── src/
│   │   ├── controllers/           # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── menu.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── tables.controller.ts
│   │   │   └── reports.controller.ts
│   │   ├── models/                # Database models (Drizzle schemas)
│   │   │   ├── user.model.ts
│   │   │   ├── menu.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── table.model.ts
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── menu.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   └── index.ts
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── menu.service.ts
│   │   │   └── order.service.ts
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── config/                # Configuration files
│   │   │   ├── database.ts
│   │   │   └── environment.ts
│   │   ├── utils/                 # Utility functions
│   │   └── app.ts                 # Express app setup
│   ├── migrations/                # Database migrations
│   ├── package.json
│   ├── drizzle.config.ts
│   └── tsconfig.json
│
├── shared/                        # Shared types and utilities
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── menu.types.ts
│   │   └── api.types.ts
│   ├── constants/
│   └── utils/
│
├── docs/                         # Documentation
├── .env.example
├── .gitignore
├── README.md
└── package.json (root)
```

## 🚀 Migration Steps:

### Phase 1: Backend Separation ✅ COMPLETED
1. ✅ Create dedicated backend folder structure
2. ✅ Move server logic to proper controllers/services pattern
3. ✅ Setup Supabase integration with Drizzle ORM
4. ✅ Create proper API routes with validation

### Phase 2: Frontend Modernization 🚧 IN PROGRESS
1. ✅ Convert to Next.js App Router structure
2. 🚧 Organize components by feature domains (30% complete)
3. ✅ Setup proper API client layer
4. ✅ Implement proper state management

### Phase 3: Shared Resources ✅ COMPLETED
1. ✅ Extract common types to shared folder
2. ✅ Setup proper build and deployment scripts
3. ✅ Configure environment variables properly

### Phase 4: Integration & Testing 🔄 NEXT
1. ⏳ Migrate existing components to new structure
2. ⏳ Connect frontend to new backend API
3. ⏳ Setup database with Supabase
4. ⏳ Test complete application workflow

## 🔧 Benefits of This Structure:

✅ **Scalability**: Clear separation of concerns
✅ **Maintainability**: Feature-based organization
✅ **Developer Experience**: Intuitive folder navigation
✅ **Production Ready**: Industry standard patterns
✅ **Team Collaboration**: Clear ownership boundaries
✅ **Testing**: Easy to unit test isolated components
✅ **Performance**: Optimized bundle splitting