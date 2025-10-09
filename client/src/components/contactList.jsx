import { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./contactList.scss";

export default function ContactList({
  contacts,
  handleEdit,
  errorMessage = "",
  handleDelete,
}) {
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const handleEditClick = (contact) => {
    setEditingContact(contact._id);
    setFormData({
      firstname: contact.firstname,
      lastname: contact.lastname,
      phone: contact.phone,
    });
    setOriginalData({
      firstname: contact.firstname,
      lastname: contact.lastname,
      phone: contact.phone,
    });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingContact(null);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};

    // validation champs vides
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "Field cannot be empty";
      }

      if (key === "phone" && !isValidPhoneNumber(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // créer l'objet avec seulement les champs modifiés
    const modifiedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        modifiedFields[key] = formData[key];
      }
    });

    if (Object.keys(modifiedFields).length === 0) {
      setEditingContact(null);
      return;
    }

    handleEdit(editingContact, modifiedFields);
    setEditingContact(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteContact = (idContact) => {
    handleDelete(idContact);
  };

  return (
    <div className="w-full flex justify-center relative">
      <ul className="list bg-base-100 rounded-box shadow-md w-100 relative">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Contact List
        </li>

        {contacts && contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact._id} className="list-row relative">
              <div className="flex items-center justify-between w-90">
                <div>
                  <div className="font-semibold">
                    {contact.firstname} {contact.lastname}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {contact.phone}
                  </div>
                </div>

                <div className="flex gap-1 flex-end">
                  <button
                    className="btn btn-square btn-ghost"
                    onClick={() => handleEditClick(contact)}
                    title="Modifier"
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-square btn-ghost"
                    onClick={() => handleDeleteContact(contact._id)}
                    title="Supprimer"
                  >
                    ❌
                  </button>
                </div>
              </div>

              {editingContact === contact._id && (
                <div className="absolute top-0 left-0 bg-base-200 p-3 rounded-lg shadow-md z-10 w-full">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Firstname"
                      className={`input input-bordered input-sm w-full ${
                        errors.firstname ? "border-red-900" : ""
                      }`}
                    />
                    {errors.firstname && (
                      <p className="text-red-900 text-xs">{errors.firstname}</p>
                    )}

                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Lastname"
                      className={`input input-bordered input-sm w-full ${
                        errors.lastname ? "border-red-900" : ""
                      }`}
                    />
                    {errors.lastname && (
                      <p className="text-red-900 text-xs">{errors.lastname}</p>
                    )}

                    <PhoneInput
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          phone: "+" + value,
                        }));
                      }}
                      placeholder="Phone number"
                      className={`input input-bordered input-sm w-full ${
                        errors.phone ? "border-red-900" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-900 text-xs">{errors.phone}</p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-xs btn-success"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={handleCancel}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="p-4 text-sm opacity-60">No contact</li>
        )}
        {errorMessage && (
          <p className="text-red-900 text-center text-sm px-6 py-7">
            {errorMessage}
          </p>
        )}
      </ul>
    </div>
  );
}
