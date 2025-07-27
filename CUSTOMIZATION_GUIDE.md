# Restaurant Management System - Customization Guide

## 🚀 Overview
This Restaurant Management System is designed to be a white-label solution that can be easily customized for any restaurant by simply modifying the `data.json` file and adding assets.

## 📁 File Structure for Customization

```
/public/
  ├── data.json          # Main configuration file (MODIFY THIS)
  └── assets/            # Restaurant-specific images and assets
      ├── cafe_logo.png  # Restaurant logo
      ├── masalaTea.jpeg # Menu item images
      └── ...            # Other menu item images
```

## 🔧 How to Customize for Different Restaurants

### Step 1: Update `data.json`
Replace the contents of `/public/data.json` with your restaurant's information:

```json
{
  "restaurantName": "Your Restaurant Name",
  "logo": "/assets/your_logo.png",
  "address": "Your Restaurant Address",
  "phone": "Your Phone Number",
  "email": "your@email.com",
  "language": "en",
  "supportedLanguages": ["en", "hi"],
  "currency": "₹",
  "gstRate": 18,
  "theme": "auto",
  
  "menu": [
    {
      "id": 1,
      "name": {
        "en": "Item Name in English",
        "hi": "आइटम का नाम हिंदी में"
      },
      "category": "Category Name",
      "price": 100,
      "description": {
        "en": "Description in English",
        "hi": "हिंदी में विवरण"
      },
      "available": true,
      "veg": true,
      "image": "/assets/item_image.jpg",
      "ingredients": ["ingredient1", "ingredient2"],
      "allergens": ["allergen1"]
    }
  ],
  
  "categories": [
    {
      "id": "category-id",
      "name": {
        "en": "Category Name",
        "hi": "श्रेणी का नाम"
      },
      "icon": "🍽️",
      "order": 1,
      "active": true
    }
  ],
  
  "tables": [
    {
      "id": 1,
      "name": "T1",
      "capacity": 4,
      "floor": "Ground",
      "status": "available",
      "position": { "x": 100, "y": 100 },
      "shape": "square"
    }
  ]
}
```

### Step 2: Add Restaurant Assets
1. Replace `/public/assets/cafe_logo.png` with your restaurant's logo
2. Add menu item images to `/public/assets/` folder
3. Update image paths in `data.json` to match your asset filenames

### Step 3: Multilingual Support
The system supports multiple languages. To add translations:

```json
"name": {
  "en": "English Name",
  "hi": "हिंदी नाम",
  "ta": "தமிழ் பெயர்",
  "gu": "ગુજરાતી નામ"
}
```

## 📋 Required Data Structure

### Restaurant Information
- `restaurantName`: Your restaurant name
- `logo`: Path to your logo image
- `address`: Restaurant address
- `phone`: Contact phone number
- `email`: Contact email
- `currency`: Currency symbol (₹, $, €, etc.)
- `gstRate`: Tax rate percentage

### Menu Items
Each menu item should have:
- `id`: Unique identifier
- `name`: Localized names object
- `category`: Category name
- `price`: Price in your currency
- `description`: Localized descriptions
- `available`: Boolean for availability
- `veg`: Boolean for vegetarian
- `image`: Path to item image
- `ingredients`: Array of ingredients
- `allergens`: Array of allergens

### Categories
Each category should have:
- `id`: Unique identifier
- `name`: Localized names object
- `icon`: Emoji or icon
- `order`: Display order number
- `active`: Boolean for active status

### Tables
Each table should have:
- `id`: Unique identifier
- `name`: Table display name
- `capacity`: Number of seats
- `floor`: Floor name
- `status`: "available", "occupied", "reserved", or "cleaning"
- `position`: {x, y} coordinates for layout
- `shape`: "square", "rectangle", or "round"

## 🎨 Customization Features

### 1. **Complete Data-Driven Design**
- All restaurant information loads from `data.json`
- No hardcoded restaurant data in the code
- Easy to rebrand for different clients

### 2. **Multilingual Support**
- Built-in support for multiple languages
- Easy to add new language translations
- Language toggle button in the top bar

### 3. **Dynamic Menu Management**
- Menu items and categories from `data.json`
- Localized item names and descriptions
- Dynamic pricing and availability

### 4. **Flexible Table Management**
- Table layout from configuration
- Different shapes and capacities
- Floor-based organization

### 5. **Asset Management**
- Logo and menu item images
- All assets load from `/public/assets/`
- Easy to replace with client-specific images

## 🛠️ For Developers

### Build for Production
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### File Watch
The application automatically reloads when:
- `data.json` is modified
- Assets in `/public/assets/` are changed

## 📝 Client Deployment Checklist

1. ✅ Update `data.json` with restaurant information
2. ✅ Replace logo in `/public/assets/`
3. ✅ Add menu item images to `/public/assets/`
4. ✅ Set correct currency and tax rates
5. ✅ Configure table layout and capacities
6. ✅ Test multilingual functionality
7. ✅ Verify all menu items display correctly
8. ✅ Test order management workflow

## 🎯 Benefits for Restaurant Owners

- **Easy Deployment**: Just update data file and assets
- **Multilingual Ready**: Serve customers in their preferred language
- **Professional Look**: Clean, modern interface
- **Mobile Responsive**: Works on all devices
- **Real-time Updates**: Live order and table management
- **Comprehensive Reports**: Sales analytics and insights

## 💡 Advanced Customization

For advanced customization beyond data changes:
- Theme colors can be modified in the CSS
- Additional languages can be added to the language system
- Custom fields can be added to the data structure
- Integration points available for external systems

---

**Ready to deploy?** Simply update your `data.json` and assets, then build the application!
