// routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';

const router = Router();

// GET /api/users
router.get('/', getAllUsers);   

export default router;
