import User from "../models/User.js";
import Contact from "../models/Contact.js";

export async function getContacts(req, res) {
  try {
    const idUser = req.auth.userId;

    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ error: "idUser invalid" });
    }

    const userContacts = await Contact.find({ idUser: idUser });
    res.status(200).json({ message: userContacts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
