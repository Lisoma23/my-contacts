import { Router } from "express";
import { getContacts } from "../controllers/getContacts.js";
import { addContacts } from "../controllers/addContact.js";
import { patchContact } from "../controllers/patchContact.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/get", requireAuth, getContacts);
router.post("/add", requireAuth, addContacts);
router.patch("/:id", requireAuth, patchContact);

export default router;
