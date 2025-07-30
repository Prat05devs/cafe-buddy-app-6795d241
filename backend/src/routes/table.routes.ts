import { Router } from 'express';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
  generateQRCode,
  getAvailableTables,
  getOccupiedTables,
} from '@/controllers/table.controller';
import { authMiddleware, requireRole } from '@/middleware/auth.middleware';
import { validateBody, validateParams } from '@/middleware/validation.middleware';
import { insertTableSchema, updateTableSchema } from '@/models/table.model';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

// All routes require authentication
router.use(authMiddleware);

router.get('/', getTables);
router.get('/available', getAvailableTables);
router.get('/occupied', getOccupiedTables);
router.get('/:id', validateParams(idParamSchema), getTableById);
router.post('/', requireRole(['admin', 'manager']), validateBody(insertTableSchema), createTable);
router.put('/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), validateBody(updateTableSchema), updateTable);
router.patch('/:id/status', validateParams(idParamSchema), updateTableStatus);
router.patch('/:id/qr-code', requireRole(['admin', 'manager']), validateParams(idParamSchema), generateQRCode);
router.delete('/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), deleteTable);

export default router;