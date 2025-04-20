import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { createTableC, deleteTableC, getTable, getTables, updateTableC } from "../controllers/tableController.js";

const router = express.Router();

router.get('/', verifyToken, getTables);
router.get('/:id', verifyToken, getTable);
router.post('/', verifyToken, checkRole(['admin']), createTableC);
router.put('/:id', verifyToken, checkRole(['admin']), updateTableC);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteTableC);

export default router;