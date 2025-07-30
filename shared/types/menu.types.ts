// Menu-related types shared between frontend and backend
export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  categoryId?: number;
  image?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
  prepTime?: number;
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: string;
  categoryId?: number;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
  prepTime?: number;
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
}