import { Router } from "express";
import { addContacts } from "../controllers/addContacts.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.post("/add", requireAuth, addContacts);

export default router;
