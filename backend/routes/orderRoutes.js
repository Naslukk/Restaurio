import express from "express";
import { createOrderC, getOrderDetails, getOrders, updateStatus } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post('/', verifyToken, checkRole(['waiter', 'admin']), createOrderC);
router.get('/', verifyToken, checkRole(['kitchen', 'admin']), getOrders);
router.get('/:id/items', verifyToken, getOrderDetails);
router.put('/:id/status', verifyToken, checkRole(['kitchen', 'admin']), updateStatus);

export default router;
