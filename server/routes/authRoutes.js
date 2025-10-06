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
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                example :
 *                  message : User created
 *       400:
 *         description: Erreurs de validation sur un ou plusieurs champs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *             examples:
 *               all_missing:
 *                 summary: Tous les champs sont manquants
 *                 value :
 *                   firstname: User firstname required
 *                   lastname: User lastname required
 *                   email: User email required
 *                   phone: User phone number required
 *                   password: Password is required
 *               one_missing:
 *                 summary: Un seul champ est manquant (ici l'email)
 *                 value :
 *                   email: User email required
 *
 *       403:
 *         description: L'email ou le téléphone est déjà utilisé
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                example :
 *                  message : Email or Phone already in use
 *       500:
 *         description: Autre type d'erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example :
 *                error : Server error
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
 *       400:
 *         description: Un des champs est manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples :
 *                email_missing :
 *                  value :
 *                    message : User email required
 *                password_missing :
 *                  value :
 *                    message : User password required
 *       401:
 *         description: Mot de passe ou email incorrect
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              example :
 *                message : Incorrect Login/Password
 *       500:
 *         description: Autre type d'erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example :
 *                 error : Server error
 */
router.post("/login", loginUser);

export default router;
