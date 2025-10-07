import { Router } from "express";
import { registerUser } from "../controllers/registerUser.js";
import { loginUser } from "../controllers/loginUser.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags :
 *       - Authentification
 *     summary: Crée un nouvel utilisateur
 *     description: >
 *       Crée un nouvel utilisateur avec les champs `firstname`, `lastname`, `email`, `phone` et `password`.
 *       Le mot de passe est automatiquement haché avant d'être stocké.
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
 *               invalid_phone:
 *                 summary: Le numéro de téléphone est invalide
 *                 value :
 *                   phone: 1234 is not a valid phone number!
 *               invalid_email:
 *                 summary: L'email est invalide
 *                 value :
 *                   email: hello123.com is not a valid email!
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
 *     tags :
 *       - Authentification
 *     summary: Authentifie un utilisateur et retourne un JWT
 *     description: >
 *       Authentifie un utilisateur avec son `email` et son `password`.
 *       Si les informations sont correctes, retourne un token JWT à utiliser pour les requêtes authentifiées.
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
