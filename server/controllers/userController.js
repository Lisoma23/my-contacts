import User from "../models/User.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
