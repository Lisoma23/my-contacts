import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "User email required" });
    if (!password)
      return res.status(400).json({ message: "User password required" });

    const user = await User.findOne({ email });

    let match = null;

    //verifier password
    if (user) match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Incorrect Login/Password" });

    //Crée un  JWT qui expire au bout de 7j --> le user sera déco au bout de 7j
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      userName: user.firstname,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
