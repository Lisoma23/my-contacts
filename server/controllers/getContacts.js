import User from "../models/User.js";
import Contact from "../models/Contact.js";

export async function getContacts(req, res) {
  try {
    const { idUser } = req.body;

    if (!idUser) res.status(400).json({ error: "idUser Required" });

    try {
      await User.findById(idUser).exec();
    } catch {
      res.status(404).json({ error: "idUser invalid" });
    }

    const userContacts = await Contact.find({ idUser: idUser }).exec();
    res.status(200).json({ message: userContacts });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
