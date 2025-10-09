import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { serverUrl } from "../App";
import { useOnlineStatus } from "../components/useOnlineStatus";
import { isValidPhoneNumber } from "libphonenumber-js";
import ContactList from "../components/contactList";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Home() {
  const firstname = localStorage.getItem("userFirstname");
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [addingContact, setAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [newErrors, setNewErrors] = useState({});

  const isOnline = useOnlineStatus();

  const controller = new AbortController(); //gérer l'annulation si l'utilisateur perd la co en plein milieu d'un requete
  const signal = controller.signal;

  useEffect(() => {
    if (isOnline) {
      setErrorMessage("");
      getContactList();
    } else if (!isOnline) {
      setErrorMessage(
        "No connection — please check your internet connection and try again."
      );
    }
  }, [isOnline]);

  //récupère les contacts
  const getContactList = () => {
    //vérifie toutes les 500ms si l'utilisateur perd sa co
    const checkConnectionInterval = setInterval(() => {
      if (!isOnline) {
        controller.abort();
        clearInterval(checkConnectionInterval);
        setErrorMessage("Connection lost during login. Please try again.");
      }
    }, 500);

    fetch(serverUrl + "contact/get", {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      signal,
    })
      .then((res) => {
        if (res.status === 401 || res.status == 404)
          setErrorMessage(
            "An error has occurred. If this error persists, please log in again."
          );
        else if (res.status == 500) throw new Error();
        else if (res.status == 200) return res.json();
      })
      .then((data) => {
        if (data) {
          setContacts(data.message);
        }
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      })
      .finally(() => {
        clearInterval(checkConnectionInterval);
      });
  };

  useEffect(() => {
    getContactList();
  }, []);

  //modifie un contact
  const editContact = (id, updatedContact) => {
    //vérifie toutes les 500ms si l'utilisateur perd sa co
    const checkConnectionInterval = setInterval(() => {
      if (!isOnline) {
        controller.abort();
        clearInterval(checkConnectionInterval);
        setErrorMessage("Connection lost during login. Please try again.");
      }
    }, 500);

    fetch(serverUrl + "contact/patch/" + id, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
      signal,
    })
      .then((res) => {
        if (res.status === 401)
          setErrorMessage(
            "An error has occurred. If this error persists, please log in again."
          );
        else if (res.status == 403 || res.status == 304 || res.status == 404)
          setErrorMessage("Contact not Modified");
        else if (res.status == 500) throw new Error();
        else if (res.status == 200) return res.json();
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      })
      .finally(() => {
        clearInterval(checkConnectionInterval);
        getContactList();
      });
  };

  //supprime un contact
  const deleteContact = (id) => {
    //vérifie toutes les 500ms si l'utilisateur perd sa co
    const checkConnectionInterval = setInterval(() => {
      if (!isOnline) {
        controller.abort();
        clearInterval(checkConnectionInterval);
        setErrorMessage("Connection lost during login. Please try again.");
      }
    }, 500);

    fetch(serverUrl + "contact/delete/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      signal,
    })
      .then((res) => {
        if (res.status === 401)
          setErrorMessage(
            "An error has occurred. If this error persists, please log in again."
          );
        else if (res.status == 403 || res.status == 404)
          setErrorMessage("Contact not Modified");
        else if (res.status == 500) throw new Error();
        else if (res.status == 200) return res.json();
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      })
      .finally(() => {
        clearInterval(checkConnectionInterval);
        getContactList();
      });
  };

  const handleChangeNewContact = (e) => {
    setNewContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveNewContact = () => {
    //vérifie toutes les 500ms si l'utilisateur perd sa co
    const checkConnectionInterval = setInterval(() => {
      if (!isOnline) {
        controller.abort();
        clearInterval(checkConnectionInterval);
        setErrorMessage("Connection lost during login. Please try again.");
      }
    }, 500);

    const errors = {};

    if (!newContact.firstname.trim()) errors.firstname = "Firstname required";
    if (!newContact.lastname.trim()) errors.lastname = "Lastname required";
    if (!newContact.phone.trim() || !isValidPhoneNumber(newContact.phone))
      errors.phone = "Invalid phone number";

    setNewErrors(errors);
    if (Object.keys(errors).length > 0) return;

    fetch(serverUrl + "contact/add", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    })
      .then((res) => {
        if (res.status === 401)
          setErrorMessage(
            "An error has occurred. If this error persists, please log in again."
          );
        else if (res.status === 400 || res.status == 404)
          setErrorMessage("Contact not created");
        else if (res.status === 409) setErrorMessage("Contact already exists");
        else if (res.status == 500) throw new Error();
        else if (res.status === 201) return res.json();
      })
      .then(() => {
        setNewContact({ firstname: "", lastname: "", phone: "" });
        setNewErrors({});
        setAddingContact(false);
        getContactList();
        setErrorMessage("");
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      })
      .finally(() => {
        clearInterval(checkConnectionInterval);
      });
  };

  const handleCancelNewContact = () => {
    setAddingContact(false);
    setNewContact({ firstname: "", lastname: "", phone: "" });
    setNewErrors({});
  };
  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <h1 className="text-2xl">Welcome {firstname} !</h1>

      <ContactList
        contacts={contacts}
        errorMessage={errorMessage}
        handleEdit={editContact}
        handleDelete={deleteContact}
      />

      <div className="w-full flex justify-center">
        <div className="w-100 mt-6">
          <div className="flex justify-between">
            <button
              className="btn btn-success"
              onClick={() => setAddingContact(!addingContact)}
            >
              {addingContact ? "Cancel" : "Add a new contact"}
            </button>

            <button
              className="btn btn-error"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>

          {addingContact && (
            <div className="flex flex-col gap-2 mt-2 bg-base-100 p-4 rounded-lg shadow-md">
              <input
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={newContact.firstname}
                onChange={handleChangeNewContact}
                className={`input input-bordered input-sm w-full ${
                  newErrors.firstname ? "border-red-900" : ""
                }`}
              />
              {newErrors.firstname && (
                <p className="text-red-900 text-xs">{newErrors.firstname}</p>
              )}

              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={newContact.lastname}
                onChange={handleChangeNewContact}
                className={`input input-bordered input-sm w-full ${
                  newErrors.lastname ? "border-red-900" : ""
                }`}
              />
              {newErrors.lastname && (
                <p className="text-red-900 text-xs">{newErrors.lastname}</p>
              )}

              <PhoneInput
                country="fr"
                value={newContact.phone}
                onChange={(value) =>
                  setNewContact((prev) => ({ ...prev, phone: "+" + value }))
                }
                className={`input input-bordered input-sm w-full ${
                  newErrors.phone ? "border-red-900" : ""
                }`}
              />
              {newErrors.phone && (
                <p className="text-red-900 text-xs">{newErrors.phone}</p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="btn btn-xs btn-success"
                  onClick={handleSaveNewContact}
                >
                  Save
                </button>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={handleCancelNewContact}
                >
                  ❌
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
