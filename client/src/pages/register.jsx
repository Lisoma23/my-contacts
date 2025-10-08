import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { serverUrl } from "../App";
import Form from "../components/form";
import { useOnlineStatus } from "../components/useOnlineStatus";

export default function register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const controller = new AbortController(); //gérer l'annulation si l'utilisateur perd la co en plein milieu d'un requete
  const signal = controller.signal;

  const fields = [
    {
      name: "firstname",
      label: "Firstname",
      type: "firstname",
      placeholder: "Your firstname",
    },
    {
      name: "lastname",
      label: "Lastname",
      type: "lastname",
      placeholder: "Your lastname",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
    },
    {
      name: "phone",
      label: "Phone",
      type: "phone",
      placeholder: "Your phone number",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Your password",
    },
    {
      name: "passwordConfirm",
      label: "Repeat Password",
      type: "password",
      placeholder: "Re-enter your password",
    },
  ];

  useEffect(() => {
    if (isOnline) {
      setLoading(false);
      setErrorMessage("");
    } else if (!isOnline) {
      setLoading(true);
      setErrorMessage(
        "No connection — please check your internet connection and try again."
      );
    }
  }, [isOnline]);

  const handleSubmit = ({ firstname, lastname, email, phone, password }) => {
    setLoading(true);

    //vérifie toutes les 500ms si l'utilisateur perd sa co
    const checkConnectionInterval = setInterval(() => {
      if (!isOnline) {
        controller.abort();
        clearInterval(checkConnectionInterval);
        setErrorMessage("Connection lost during login. Please try again.");
        setLoading(false);
      }
    }, 500);

    fetch(serverUrl + "auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone,
        password,
      }),
      signal,
    })
      .then((res) => {
        if (res.status == 400) setErrorMessage("Please fill every field");
        else if (res.status == 403)
          setErrorMessage("Email or Phone already in use");
        else if (res.status == 500) throw new Error();
        else if (res.status == 201) return res.json();
      })
      .then((data) => {
        if (data) navigate("/");
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      })
      .finally(() => {
        setLoading(false);
        clearInterval(checkConnectionInterval);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl">Welcome !</h1>

      <Form
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        errorMessage={errorMessage}
        submitLabel={"Create an Account"}
        formName={"Register"}
      />
    </div>
  );
}
