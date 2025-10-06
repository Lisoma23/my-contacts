import Contact from "../models/Contact.js";
import User from "../models/User.js";

export async function addContacts(req, res) {
  try {
    const { firstname, lastname, phone, idUser } = req.body;

    try {
      await User.findById(idUser).exec();
    } catch {
      res.status(404).json({ error: "idUser invalid" });
    }

    try {
      const userContact = await Contact.find({ idUser, phone });
      if (userContact.length != 0) {
        res.status(409).json({ error: "Contact already exists" });
      }
    } catch {
      res.status(500).json({ error: err });
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
    res.status(500).json({ error: err });
  }
}
