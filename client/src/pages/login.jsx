import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import Form from "../components/form";
import { useOnlineStatus } from "../components/useOnlineStatus";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const controller = new AbortController(); //gérer l'annulation si l'utilisateur perd la co en plein milieu d'un requete
  const signal = controller.signal;

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Your password",
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

  const handleSubmit = ({ email, password }) => {
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

    fetch(serverUrl + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      signal,
    })
      .then((res) => {
        if (res.status == 401) setErrorMessage("Incorrect Email or Password");
        else if (res.status == 500) throw new Error();
        else if (res.status == 200) return res.json();
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("userFirstname", data.userName);
          localStorage.setItem("userToken", data.token);
          navigate("/home");
        }
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
      <h1 className="text-4xl">Welcome back !</h1>

      <Form
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        errorMessage={errorMessage}
        submitLabel={"Login"}
        formName={"Login"}
      />
    </div>
  );
}
