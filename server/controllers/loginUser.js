import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) res.status(400).json({ message: "User email required" });
    if (!password) res.status(400).json({ message: "User password required" });

    const user = await User.findOne({ email });

    let match = null;

    //verifier password
    if (user) match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(401).json({ message: "Incorrect Login/Password" });
      return;
    }

    //Crée un  JWT qui expire au bout de 7j --> le user sera déco au bout de 7j
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(user, password);

    res.status(200).json({
      userId: user.id,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
