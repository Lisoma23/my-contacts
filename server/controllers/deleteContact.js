import Contact from "../models/Contact.js";

export async function deleteContact(req, res) {
  try {
    const idContact = req.params.id;
    const idUser = req.auth.userId;

    //s'assurer que c'est bien l'user qui delete son contact
    const contact = await Contact.findById(idContact);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    if (contact.idUser.toString() !== idUser) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this contact" });
    }

    const deletedContact = await Contact.findByIdAndDelete(idContact);

    if (!deletedContact)
      return res.status(404).json({ error: "Contact not found" });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
