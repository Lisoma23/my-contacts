import { Router } from "express";
import { getContacts } from "../controllers/getContacts.js";
import { addContacts } from "../controllers/addContact.js";
import { patchContact } from "../controllers/patchContact.js";
import { deleteContact } from "../controllers/deleteContact.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

/**
 * @swagger
 * /contact/get:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Récupère la liste des contacts d’un utilisateur (avec test JWT)
 *     description: >
 *       Retourne tous les contacts associés à un utilisateur donné.
 *       L'utilisateur doit être authentifié via `requireAuth`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67202b4d8a2c5f0012345678"
 *                       firstname:
 *                         type: string
 *                         example: "John"
 *                       lastname:
 *                         type: string
 *                         example: "Doe"
 *                       phone:
 *                         type: string
 *                         example: "+33612345678"
 *                       idUser:
 *                         type: string
 *                         example: "671a9b8b4c6d2f001234abcd"
 *       401:
 *         description: Jeton d’authentification invalide ou manquant - idUser manquant
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
 *               no_idUser:
 *                 summary: idUser manquant
 *                 value:
 *                   error: "idUser Required"
 *       404:
 *         description: idUser invalide (utilisateur introuvable)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "idUser invalid"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

router.get("/get", requireAuth, getContacts);

/**
 * @swagger
 * /contact/add:
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Ajoute un contact pour un utilisateur (avec test JWT)
 *     description: >
 *       Crée un nouveau contact avec les champs `firstname`, `lastname`, `phone`, `idUser` associé à un utilisateur donné.
 *       L'utilisateur doit être authentifié via `requireAuth`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - phone
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Prénom du contact
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 description: Nom du contact
 *                 example: "Doe"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone du contact (format international)
 *                 example: "+33612345678"
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact created"
 *       400:
 *         description: Erreur de validation des champs ou format de téléphone invalide
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
 *               invalid_phone:
 *                 summary: Numéro de téléphone invalide
 *                 value:
 *                   errors:
 *                     phone: "+33123456 is not a valid phone number!"
 *               missing_fields:
 *                 summary: Champs manquants
 *                 value:
 *                   errors:
 *                     firstname: User firstname required
 *                     lastname: User lastname required
 *                     phone: User phone number required
 *                     idUser: idUser required
 *       401:
 *         description: Jeton d’authentification invalide ou manquant - idUser manquant
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
 *               no_idUser:
 *                 summary: idUser manquant
 *                 value:
 *                   error: "idUser Required"
 *
 *       404:
 *         description: idUser invalide (utilisateur introuvable)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "idUser invalid"
 *       409:
 *         description: Le contact existe déjà pour cet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact already exists"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/add", requireAuth, addContacts);

/**
 * @swagger
 * /contact/patch/{id}:
 *   patch:
 *     tags:
 *       - Contacts
 *     summary: Met à jour un contact existant (authentification requise)
 *     description: >
 *       Met à jour les informations d’un contact identifié par son **ID**.
 *       L'utilisateur doit être authentifié via un jeton JWT (`requireAuth`).
 *       Seul le propriétaire du contact peut le modifier.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à modifier
 *         schema:
 *           type: string
 *           example: "67202b4d8a2c5f0012345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Nouveau prénom du contact
 *                 example: "Jane"
 *               lastname:
 *                 type: string
 *                 description: Nouveau nom du contact
 *                 example: "Smith"
 *               phone:
 *                 type: string
 *                 description: Nouveau numéro de téléphone (format international)
 *                 example: "+33765432109"
 *     responses:
 *       200:
 *         description: Contact mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67202b4d8a2c5f0012345678"
 *                 firstname:
 *                   type: string
 *                   example: "Jane"
 *                 lastname:
 *                   type: string
 *                   example: "Smith"
 *                 phone:
 *                   type: string
 *                   example: "+33765432109"
 *                 userId:
 *                   type: string
 *                   example: "671a9b8b4c6d2f001234abcd"
 *       304:
 *         description: Aucun contact modifié (ID introuvable ou données inchangées)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact not modified"
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
 *               no_idUser:
 *                 summary: idUser manquant
 *                 value:
 *                   error: "idUser Required"
 *       403:
 *         description: L’utilisateur n’est pas autorisé à modifier ce contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized to edit this contact"
 *       404:
 *         description: Contact introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.patch("/patch/:id", requireAuth, patchContact);

/**
 * @swagger
 * /contact/delete/{id}:
 *   delete:
 *     tags:
 *       - Contacts
 *     summary: Supprime un contact existant (authentification requise)
 *     description: >
 *       Supprime définitivement un contact identifié par son **ID**.
 *       L'utilisateur doit être authentifié via un jeton JWT (`requireAuth`).
 *       Seul le propriétaire du contact est autorisé à le supprimer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à supprimer
 *         schema:
 *           type: string
 *           example: "67202b4d8a2c5f0012345678"
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact deleted successfully"
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
 *               no_idUser:
 *                 summary: idUser manquant
 *                 value:
 *                   error: "idUser Required"
 *       403:
 *         description: L’utilisateur n’est pas autorisé à supprimer ce contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized to delete this contact"
 *       404:
 *         description: Contact introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

router.delete("/delete/:id", requireAuth, deleteContact);

export default router;
