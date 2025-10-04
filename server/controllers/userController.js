import User from '../models/User.js';

export async function getAllUsers(req, res) {
    try {
        //permet de tester le middleware authJWT
        // const userQuiAFaitLaRequete = await User.findById(req.auth.userId);
        // console.log(userQuiAFaitLaRequete);

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}