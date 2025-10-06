import Contact from "../models/Contact.js";

export async function patchContact(req, res) {
  try {
    const updates = req.body;
    const idContact = req.params.id;

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
    res.status(500).json({ error: err });
  }
}
