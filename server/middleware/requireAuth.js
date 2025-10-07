import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  try {
    if (req.headers.authorization === undefined) throw "No token.";
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!userId) return res.status(401).json({ error: "idUser Required" });
    req.auth = { userId }; //permet d'avoir le user.id de l'user qui effectue la requête dans la suite de requête
    next();
  } catch (err) {
    console.log(err);
    if (err == "No token.")
      return res.status(401).json({ error: "No token provided." });
    res.status(401).json({ error: "Invalid Token" });
  }
}
