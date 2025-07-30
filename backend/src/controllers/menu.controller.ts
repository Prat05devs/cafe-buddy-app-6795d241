import { Response } from 'express';
import { MenuService } from '@/services/menu.service';
import { 
  insertMenuItemSchema, 
  insertCategorySchema,
  updateMenuItemSchema,
  updateCategorySchema
} from '@/models';
import { AppError, asyncHandler } from '@/middleware/error.middleware';
import { AuthRequest } from '@/middleware/auth.middleware';

// Category controllers
export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await MenuService.getAllCategories();
  
  res.json({
    success: true,
    data: { categories },
  });
});

export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const category = await MenuService.getCategoryById(parseInt(id));
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.json({
    success: true,
    data: { category },
  });
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData = insertCategorySchema.parse(req.body);
  const category = await MenuService.createCategory(validatedData);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validatedData = updateCategorySchema.parse(req.body);
  
  const category = await MenuService.updateCategory(parseInt(id), validatedData);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const success = await MenuService.deleteCategory(parseInt(id));
  
  if (!success) {
    throw new AppError('Category not found', 404);
  }

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

// Menu item controllers
export const getMenuItems = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.query;
  
  let menuItems;
  if (categoryId) {
    menuItems = await MenuService.getMenuItemsByCategory(parseInt(categoryId as string));
  } else {
    menuItems = await MenuService.getAllMenuItems();
  }

  res.json({
    success: true,
    data: { menuItems },
  });
});

export const getMenuItemById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuService.getMenuItemById(parseInt(id));
  
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  res.json({
    success: true,
    data: { menuItem },
  });
});

export const createMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData = insertMenuItemSchema.parse(req.body);
  const menuItem = await MenuService.createMenuItem(validatedData);

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    data: { menuItem },
  });
});

export const updateMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validatedData = updateMenuItemSchema.parse(req.body);
  
  const menuItem = await MenuService.updateMenuItem(parseInt(id), validatedData);
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  res.json({
    success: true,
    message: 'Menu item updated successfully',
    data: { menuItem },
  });
});

export const toggleMenuItemAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuService.toggleMenuItemAvailability(parseInt(id));
  
  if (!menuItem) {
    throw new AppError('Menu item not found', 404);
  }

  res.json({
    success: true,
    message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
    data: { menuItem },
  });
});

export const deleteMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const success = await MenuService.deleteMenuItem(parseInt(id));
  
  if (!success) {
    throw new AppError('Menu item not found', 404);
  }

  res.json({
    success: true,
    message: 'Menu item deleted successfully',
  });
});