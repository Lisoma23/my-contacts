import { Router } from "express";
import { getContacts } from "../controllers/getContacts.js";
import { addContacts } from "../controllers/addContact.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/get", requireAuth, getContacts)
router.post("/add", requireAuth, addContacts);

export default router;
