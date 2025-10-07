import Contact from "../models/Contact.js";
import User from "../models/User.js";

export async function addContacts(req, res) {
  try {
    const { firstname, lastname, phone } = req.body;
    const idUser = req.auth.userId;

    try {
      await User.findById(idUser);
    } catch {
      return res.status(404).json({ error: "idUser invalid" });
    }

    try {
      const userContact = await Contact.findOne({ idUser, phone });
      if (userContact != null) {
        return res.status(409).json({ error: "Contact already exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }

    const contacts = new Contact({
      firstname,
      lastname,
      phone,
      idUser,
    });

    try {
      await contacts.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        for (const [field, errorObj] of Object.entries(err.errors)) {
          errors[field] = errorObj.message;
        }
        return res.status(400).json({ errors });
      }
    }
    res.status(201).json({ message: "Contact created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
