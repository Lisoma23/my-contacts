import Contact from "../models/Contact.js";

export async function deleteContact(req, res) {
  try {
    const idContact = req.params.id;

    const deletedContact = await Contact.findByIdAndDelete(idContact).exec();

    if (!deletedContact)
      return res.status(404).json({ error: "Contact not found" });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
