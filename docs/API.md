# API Documentation

Base URL: `http://localhost:3001/api/v1` (development)

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors or other details
  ]
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "staff"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "staff"
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

#### POST /auth/logout
Logout user (requires authentication).

### Menu Management

#### GET /menu/categories
List all active categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Appetizers",
        "description": "Start your meal right",
        "color": "#6366f1",
        "icon": "UtensilsCrossed",
        "sortOrder": 0,
        "isActive": true
      }
    ]
  }
}
```

#### POST /menu/categories
Create a new category (requires admin/manager role).

**Request Body:**
```json
{
  "name": "Desserts",
  "description": "Sweet endings",
  "color": "#f59e0b",
  "icon": "Cookie",
  "sortOrder": 5
}
```

#### GET /menu/items
List all available menu items.

**Query Parameters:**
- `categoryId` (optional): Filter by category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "menuItems": [
      {
        "id": 1,
        "name": "Caesar Salad",
        "description": "Fresh romaine lettuce with parmesan",
        "price": "12.99",
        "categoryId": 1,
        "image": "/images/caesar-salad.jpg",
        "isAvailable": true,
        "isVegetarian": true,
        "prepTime": 15,
        "ingredients": ["lettuce", "parmesan", "croutons"],
        "allergens": ["dairy", "gluten"]
      }
    ]
  }
}
```

#### POST /menu/items
Create a new menu item (requires admin/manager role).

#### PUT /menu/items/:id
Update menu item (requires admin/manager role).

#### PATCH /menu/items/:id/toggle
Toggle menu item availability (requires admin/manager role).

#### DELETE /menu/items/:id
Delete menu item (requires admin/manager role).

### Order Management

#### GET /orders
List orders.

**Query Parameters:**
- `status` (optional): Filter by order status
- `tableId` (optional): Filter by table ID

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD123456",
        "tableId": 5,
        "type": "dine-in",
        "status": "preparing",
        "subtotal": "25.99",
        "taxAmount": "2.60",
        "total": "28.59",
        "paymentStatus": "pending",
        "customerName": "John Doe",
        "createdAt": "2025-01-30T10:30:00Z"
      }
    ]
  }
}
```

#### POST /orders
Create a new order.

**Request Body:**
```json
{
  "tableId": 5,
  "type": "dine-in",
  "customerName": "John Doe",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "unitPrice": "12.99",
      "specialInstructions": "No croutons"
    }
  ],
  "subtotal": "25.98",
  "taxAmount": "2.60",
  "total": "28.58"
}
```

#### PATCH /orders/:id/status
Update order status.

**Request Body:**
```json
{
  "status": "ready"
}
```

#### PATCH /orders/:id/payment
Update payment status (requires admin/manager role).

**Request Body:**
```json
{
  "paymentStatus": "paid",
  "paymentMethod": "card"
}
```

#### GET /orders/stats
Get order statistics (requires admin/manager role).

### Table Management

#### GET /tables
List all active tables.

**Query Parameters:**
- `floor` (optional): Filter by floor
- `status` (optional): Filter by status

#### POST /tables
Create a new table (requires admin/manager role).

**Request Body:**
```json
{
  "number": "T01",
  "capacity": 4,
  "floor": "Ground Floor",
  "section": "Window Side"
}
```

#### PUT /tables/:id
Update table (requires admin/manager role).

#### PATCH /tables/:id/status
Update table status.

**Request Body:**
```json
{
  "status": "occupied"
}
```

#### DELETE /tables/:id
Delete table (requires admin/manager role).

#### PATCH /tables/:id/qr-code
Generate QR code for table (requires admin/manager role).

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

API is rate limited to 100 requests per 15 minutes per IP address.

## Error Handling

Validation errors return detailed field-level errors:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```