import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
    try {
        const { firstname, lastname, email, phone, password } = req.body;

        //hash mon password
        const hash = await bcrypt.hash(password, 10);

        //envoie dans DB
        const user = new User({firstname, lastname, email, phone, password : hash})
        await user.save();

        res.status(200).send("OK")

        // console.log(firstname, lastname, email, phone, password, hash);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
}