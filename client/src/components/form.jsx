import { useState } from "react";
import { Link } from "react-router-dom";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Form({
  fields = [],
  onSubmit,
  loading = false,
  errorMessage = "",
  submitLabel,
  formName,
}) {
  const [values, setValues] = useState(() => {
    const initialValues = {};
    fields.forEach((field) => (initialValues[field.name] = ""));
    return initialValues;
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validateMDP = (password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const newErrors = {};

    fields.forEach((field) => {
      const value = values[field.name].trim();

      if (!value) {
        newErrors[field.name] = "Please fill this field";
        return;
      }

      if (field.type === "email" && !validateEmail(value)) {
        newErrors[field.name] = "Please enter a valid email address";
      }

      if (field.type === "phone" && !isValidPhoneNumber(value))
        newErrors[field.name] = "Please enter a valid phone number";

      if (
        field.name === "password" &&
        formName === "Register" &&
        !validateMDP(value)
      )
        newErrors[field.name] =
          "Password must contain at least 8 characters, including 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (#?!@$%^&*-).";

      if (field.name === "passwordConfirm" && value !== values["password"])
        newErrors[field.name] = "The confirmation must match the password";
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit(values);
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 h-fit">
      <legend className="fieldset-legend">{formName}</legend>
      <div
        className={`${
          formName === "Register"
            ? "grid grid-cols-2 gap-x-10 gap-y-2 w-[45vw]"
            : ""
        }`}
      >
        {fields.map((field) => (
          <div key={field.name} className="mb-3">
            {field.label && <label className="label mb-2">{field.label}</label>}

            {field.name === "phone" ? (
              <PhoneInput
                country={"fr"}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder || ""}
                className={`input w-full ${
                  errors[field.name] ? "border-red-900" : ""
                }`}
                value={values[field.name]}
                onChange={(value) => {
                  setValues({ ...values, [field.name]: "+" + value });
                }}
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder || ""}
                className={`input w-full ${
                  errors[field.name] ? "border-red-900" : ""
                }`}
                value={values[field.name]}
                onChange={handleChange}
              />
            )}
            {submitted && errors[field.name] && (
              <p className="text-red-900 text-xs pt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-2 mb-4">
        {submitLabel === "Login" ? (
          <>
            New here ?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account ?{" "}
            <Link to="/" className="underline">
              Sign in
            </Link>
          </>
        )}
      </p>
      {errorMessage && (
        <p className="text-red-900 text-center">{errorMessage}</p>
      )}

      <div
        className={`mt-2 ${
          formName === "Register" ? "w-full text-center" : ""
        }`}
      >
        <button
          className={`btn btn-neutral ${
            formName === "Register" ? "w-50" : "w-full"
          }`}
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          {loading ? "Loading..." : submitLabel}
        </button>
      </div>
    </fieldset>
  );
}
