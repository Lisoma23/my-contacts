import { Router } from 'express';
import { registerUser } from '../controllers/registerUser.js';

const router = Router();

// POST /auth/register
router.post('/register', registerUser);   

export default router;
