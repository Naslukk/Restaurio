import express from 'express';
import { downloadBillPDF, generateBill, getBillByOrder, getBills } from '../controllers/billController.js';
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post('/:order_id', verifyToken, checkRole(['admin']), generateBill);
router.get('/:order_id', verifyToken, checkRole(['admin']), getBillByOrder);
router.get('/', verifyToken, checkRole(['admin']), getBills);
router.get('/pdf/:order_id', verifyToken, checkRole(['admin']), downloadBillPDF);

export default router;