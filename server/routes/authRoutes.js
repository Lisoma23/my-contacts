import { Router } from 'express';
import { registerUser } from '../controllers/registerUser.js';
import { loginUser } from '../controllers/loginUser.js';

const router = Router();

// POST /auth/register
router.post('/register', registerUser);

// GET /auth/login
router.get('/login', loginUser)

export default router;