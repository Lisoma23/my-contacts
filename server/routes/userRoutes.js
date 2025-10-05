import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs (avec test JWT)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Invalid Token
 *       500:
 *         description: Server error
 */
router.get("/", requireAuth, getAllUsers);

export default router;
