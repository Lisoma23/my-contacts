import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    let hash = null;
    //hash mon password
    try {
      hash = await bcrypt.hash(password, 10);
    } catch (err) {
      res.status(400).json({ error: "Password is required" });
    }

    //envoie dans le model
    const user = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hash,
    });

    try {
      await user.save();
    } catch (err) {
      if (err.code == 11000)
        return res.status(403).json({ error: "Email or Phone already in use" });
      if (err.name === "ValidationError") {
        const errors = {};
        for (const [field, errorObj] of Object.entries(err.errors)) {
          errors[field] = errorObj.message; // par ex: { lastname: "User lastname required" }
        }
        return res.status(400).json({ errors });
      }
    }

    res.status(201).json({ message: "User created" });

    // console.log(firstname, lastname, email, phone, password, hash);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
