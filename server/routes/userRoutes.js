// routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

// GET /api/users + test du middleware requireAuth
router.get('/', requireAuth, getAllUsers);   

export default router;
