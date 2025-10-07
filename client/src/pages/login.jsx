import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { serverUrl } from "../App";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function submitForm(e, login, password, setErrorMessage) {
    e.preventDefault();
    if (!password || !login) {
      setErrorMessage("Please fill every field");
      setLoading(false);
      return;
    }
    await fetch(serverUrl + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login,
        password: password,
      }),
    })
      .then((res) => {
        console.log(res);
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
      });
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl">Welcome back !</h1>
      <form
        onSubmit={(e) => {
          setLoading(true);
          submitForm(e, login, password, setErrorMessage);
        }}
      >
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 h-fit">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              console.log(e.target.value);
            }}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(e.target.value);
            }}
          />

          <p>
            New here ?{" "}
            <Link to="/register" className="underline">
              Sign Up
            </Link>
          </p>

          <p className="text-red-900 text-center mt-4">{errorMessage}</p>

          <button type="submit" className="btn btn-neutral" disabled={loading}>
            Login
          </button>
        </fieldset>
      </form>
    </div>
  );
}
