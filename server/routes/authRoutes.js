import { Router } from "express";
import { registerUser } from "../controllers/registerUser.js";
import { loginUser } from "../controllers/loginUser.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Email or Phone already in use
 *       500:
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Le userId et le token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect Login/Password
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);

export default router;
