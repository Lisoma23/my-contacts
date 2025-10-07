import Contact from "../models/Contact.js";

export async function patchContact(req, res) {
  try {
    const updates = req.body;
    const idContact = req.params.id;
    const idUser = req.auth.userId;

    //empêcher la modification de l'userId du contact
    if ("idUser" in updates) {
      delete updates.idUser;
    }

    //s'assurer que c'est bien l'user qui modifie son contact
    const contact = await Contact.findById(idContact);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    if (contact.idUser.toString() !== idUser) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this contact" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      idContact,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(304).json({ message: "Contact not modified" });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
