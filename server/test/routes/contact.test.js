import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../../server.js";
import User from "../../models/User.js";
import Contact from "../../models/Contact.js";

let mongoServer;
let userId;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(uri);

  // Créer un utilisateur de test
  const user = await User.create({
    firstname: "Test",
    lastname: "User",
    email: "contact@test.com",
    phone: "+33612345678",
    password: "hashedpassword",
  });

  userId = user._id.toString();
  token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Contact.deleteMany({});
});

describe("🧑‍💻 Contact routes", () => {
  describe("POST /contact/add", () => {
    it("✅ crée un contact avec succès", async () => {
      const res = await request(app)
        .post("/contact/add")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "John", lastname: "Doe", phone: "+33712345678" });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Contact created");
    });

    it("400 → champs manquants", async () => {
      const res = await request(app)
        .post("/contact/add")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("400 → numéro de téléphone invalide", async () => {
      const res = await request(app)
        .post("/contact/add")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "Jane", lastname: "Doe", phone: "1234" });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.phone).toBeDefined();
    });

    it("401 → token manquant", async () => {
      const res = await request(app).post("/contact/add").send({
        firstname: "Jane",
        lastname: "Doe",
        phone: "+33765432109",
      });
      expect(res.statusCode).toBe(401);
    });

    it("409 → contact déjà existant", async () => {
      await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: userId,
      });
      const res = await request(app)
        .post("/contact/add")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "John", lastname: "Doe", phone: "+33712345678" });
      expect(res.statusCode).toBe(409);
    });
  });

  describe("GET /contact/get", () => {
    it("✅ récupère les contacts", async () => {
      await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: userId,
      });
      const res = await request(app)
        .get("/contact/get")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message.length).toBe(1);
    });

    it("401 → token manquant", async () => {
      const res = await request(app).get("/contact/get");
      expect(res.statusCode).toBe(401);
    });

    it("404 → idUser invalide", async () => {
      const badToken = jwt.sign({ userId: "000000000000000000000000" }, process.env.JWT_SECRET);
      const res = await request(app)
        .get("/contact/get")
        .set("Authorization", `Bearer ${badToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH /contact/patch/:id", () => {
    it("✅ met à jour un contact avec succès", async () => {
      const contact = await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: userId,
      });
      const res = await request(app)
        .patch(`/contact/patch/${contact._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "Jane" });
      expect(res.statusCode).toBe(200);
      expect(res.body.firstname).toBe("Jane");
    });

    it("403 → modifier un contact qui n'appartient pas à l'utilisateur", async () => {
      const contact = await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: "000000000000000000000000",
      });
      const res = await request(app)
        .patch(`/contact/patch/${contact._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "Jane" });
      expect(res.statusCode).toBe(403);
    });

    it("404 → contact introuvable", async () => {
      const res = await request(app)
        .patch(`/contact/patch/000000000000000000000000`)
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "Jane" });
      expect(res.statusCode).toBe(404);
    });

    it("304 → aucune modification", async () => {
      const contact = await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: userId,
      });
      const res = await request(app)
        .patch(`/contact/patch/${contact._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ firstname: "John" }); // même valeur
      expect(res.statusCode).toBe(200); // ton patchContact renvoie 200 même si inchangé
    });
  });

  describe("DELETE /contact/delete/:id", () => {
    it("✅ supprime un contact", async () => {
      const contact = await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: userId,
      });
      const res = await request(app)
        .delete(`/contact/delete/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it("403 → supprimer un contact qui n'appartient pas à l'utilisateur", async () => {
      const contact = await Contact.create({
        firstname: "John",
        lastname: "Doe",
        phone: "+33712345678",
        idUser: "000000000000000000000000",
      });
      const res = await request(app)
        .delete(`/contact/delete/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
    });

    it("404 → contact introuvable", async () => {
      const res = await request(app)
        .delete(`/contact/delete/000000000000000000000000`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
