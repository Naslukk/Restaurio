import express from "express";
import { createMenuItemC, deleteMenuItemC, getMenu, getMenuItem, updateMenuItemC } from "../controllers/menuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get('/',verifyToken, getMenu);
router.get('/:id',verifyToken, getMenuItem);
router.post('/',verifyToken,checkRole(['admin']) , createMenuItemC);
router.put('/:id',verifyToken,checkRole(['admin']), updateMenuItemC);
router.delete('/:id',verifyToken,checkRole(['admin']), deleteMenuItemC);

export default router;
