import requireAuth from "../../middleware/requireAuth.js";
import jwt from "jsonwebtoken";

describe("🔑 Middleware requireAuth", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.JWT_SECRET = "secret"; // secret pour le test
  });

  it("devrait renvoyer 401 si aucun token fourni", () => {
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided." });
  });

  it("devrait renvoyer 401 si le token est invalide", () => {
    req.headers.authorization = "Bearer invalidToken";
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Token" });
  });

  it("devrait renvoyer 401 si le token ne contient pas de userId", () => {
    const token = jwt.sign({}, process.env.JWT_SECRET); // aucun userId
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "idUser Required" });
  });

  it("devrait appeler next si le token est valide et contient userId", () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.auth).toEqual({ userId: "123" }); // <-- req.auth, pas req.user
  });
});
