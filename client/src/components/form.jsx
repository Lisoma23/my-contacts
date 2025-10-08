import { useState } from "react";
import { Link } from "react-router-dom";

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
    fields.forEach(
      (field) => (initialValues[field.name] = "")
    );
    return initialValues;
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
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
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit(values);
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 h-fit">
      <legend className="fieldset-legend">{formName}</legend>

      {fields.map((field) => (
        <div key={field.name} className="mb-3">
          {field.label && <label className="label mb-2">{field.label}</label>}
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
          {submitted && errors[field.name] && (
            <p className="text-red-900 text-sm pt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <p className="mt-2">
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
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </>
        )}
      </p>
      {errorMessage && (
        <p className="text-red-900 text-center mt-4">{errorMessage}</p>
      )}
      <button
        className="btn btn-neutral w-full"
        disabled={loading}
        onClick={() => handleSubmit()}
      >
        {loading ? "Loading..." : submitLabel}
      </button>
    </fieldset>
  );
}
