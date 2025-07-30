# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `restaurant-pos` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Go to **Database** in the left sidebar
3. Scroll down to **Connection parameters** section
4. Copy the **URI** from the "Connection pooling" section (NOT the direct connection)
5. It should look like: `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
6. Replace `[YOUR-PASSWORD]` with the database password you created

## Step 3: Set Environment Variable

In your Replit project, add the database URL as a secret:

1. Click on **Secrets** (lock icon) in the left sidebar
2. Add a new secret:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase connection string from Step 2

## Step 4: Create Database Tables

Run the following command to create all the tables:

```bash
cd backend
npm run db:push
```

When prompted, type `y` to confirm creating the tables.

## Step 5: Verify Setup

You can verify the setup by checking your Supabase dashboard:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables created:
   - `users`
   - `categories`
   - `menu_items`
   - `tables`
   - `orders`
   - `order_items`

## Step 6: Optional - Add Sample Data

You can add some initial data through the Supabase Table Editor or wait to add it through the application.

### Sample Categories:
```sql
INSERT INTO categories (name, description, color, icon) VALUES
('Appetizers', 'Start your meal right', '#ef4444', 'Utensils'),
('Main Course', 'Hearty main dishes', '#f59e0b', 'ChefHat'),
('Desserts', 'Sweet endings', '#ec4899', 'Cookie'),
('Beverages', 'Refreshing drinks', '#3b82f6', 'Coffee');
```

### Sample Tables:
```sql
INSERT INTO tables (number, capacity, floor, section) VALUES
('T01', 4, 'Ground Floor', 'Window Side'),
('T02', 2, 'Ground Floor', 'Center'),
('T03', 6, 'Ground Floor', 'Corner'),
('T04', 4, 'First Floor', 'Balcony');
```

## Features Enabled

With Supabase connected, your restaurant POS system now has:

✅ **PostgreSQL Database** - Production-ready with automatic backups
✅ **Connection Pooling** - Optimized for web applications
✅ **Real-time Subscriptions** - For live order updates (can be added)
✅ **Row Level Security** - Advanced security features
✅ **Dashboard Monitoring** - Built-in analytics and monitoring

## Next Steps

1. Test the backend API endpoints
2. Connect the frontend to use the new database
3. Add authentication and user management
4. Set up real-time subscriptions for live updates

## Troubleshooting

**Connection Issues:**
- Make sure you're using the pooled connection string (port 6543)
- Verify the password is correct
- Check that the DATABASE_URL secret is set properly

**Table Creation Issues:**
- Ensure you're in the `backend` directory when running `npm run db:push`
- Check the database permissions in Supabase

**Need Help?**
- Check the Supabase docs: https://supabase.com/docs
- Review connection logs in the Replit console