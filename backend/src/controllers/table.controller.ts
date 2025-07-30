import { Response } from 'express';
import { TableService } from '@/services/table.service';
import { insertTableSchema, updateTableSchema } from '@/models/table.model';
import { AppError, asyncHandler } from '@/middleware/error.middleware';
import { AuthRequest } from '@/middleware/auth.middleware';

export const getTables = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { floor, status } = req.query;
  
  let tables;
  if (floor) {
    tables = await TableService.getTablesByFloor(floor as string);
  } else if (status) {
    tables = await TableService.getTablesByStatus(status as string);
  } else {
    tables = await TableService.getAllTables();
  }

  res.json({
    success: true,
    data: { tables },
  });
});

export const getTableById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const table = await TableService.getTableById(parseInt(id));
  
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  res.json({
    success: true,
    data: { table },
  });
});

export const createTable = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData = insertTableSchema.parse(req.body);
  
  // Check if table number already exists
  const existingTable = await TableService.getTableByNumber(validatedData.number);
  if (existingTable) {
    throw new AppError('Table with this number already exists', 400);
  }

  const table = await TableService.createTable(validatedData);

  res.status(201).json({
    success: true,
    message: 'Table created successfully',
    data: { table },
  });
});

export const updateTable = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validatedData = updateTableSchema.parse(req.body);
  
  // If updating table number, check for duplicates
  if (validatedData.number) {
    const existingTable = await TableService.getTableByNumber(validatedData.number);
    if (existingTable && existingTable.id !== parseInt(id)) {
      throw new AppError('Table with this number already exists', 400);
    }
  }

  const table = await TableService.updateTable(parseInt(id), validatedData);
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  res.json({
    success: true,
    message: 'Table updated successfully',
    data: { table },
  });
});

export const updateTableStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('Status is required', 400);
  }

  const validStatuses = ['available', 'occupied', 'reserved', 'cleaning'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const table = await TableService.updateTableStatus(parseInt(id), status);
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  res.json({
    success: true,
    message: 'Table status updated successfully',
    data: { table },
  });
});

export const deleteTable = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const success = await TableService.deleteTable(parseInt(id));
  
  if (!success) {
    throw new AppError('Table not found', 404);
  }

  res.json({
    success: true,
    message: 'Table deleted successfully',
  });
});

export const generateQRCode = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const table = await TableService.updateQRCode(parseInt(id));
  
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  res.json({
    success: true,
    message: 'QR code generated successfully',
    data: { 
      table,
      qrCodeUrl: table.qrCodeUrl,
    },
  });
});

export const getAvailableTables = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tables = await TableService.getAvailableTables();

  res.json({
    success: true,
    data: { tables },
  });
});

export const getOccupiedTables = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tables = await TableService.getOccupiedTables();

  res.json({
    success: true,
    data: { tables },
  });
});