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
 *       L'utilisateur doit être authentifié via `requireAuth`.
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
 *         description: Jeton d’authentification invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               invalid_token:
 *                 summary: Token invalide
 *                 value:
 *                   error: "Invalid Token"
 *               no_token:
 *                 summary: Token manquant
 *                 value:
 *                   error: "No token provided."
 *       500:
 *         description: Autre type d'erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example :
 *                error : Server error
 */
router.get("/", requireAuth, getAllUsers);

export default router;
