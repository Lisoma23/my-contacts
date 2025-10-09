import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags :
 *       - User
 *     summary: Récupère la liste de tous les utilisateurs (avec test JWT)
 *     description: >
 *       Récupère la liste de tous les utilisateurs.
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
 *       500:
 *         description: Autre type d'erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example :
 *                error : Server error
 */
router.get("/", getAllUsers);

export default router;
