import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";

jest.mock("../../config/mongoDBConfig.js", () => ({
  __esModule: true,
  default: jest.fn(() =>
    console.log("⚙️ Mocked connectMongo() – no real DB connection")
  ),
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log("🧪 Connected to in-memory MongoDB for tests");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("🧑‍💻 Auth routes", () => {
  // --- REGISTER ---
  it("POST /auth/register → crée un nouvel utilisateur", async () => {
    const res = await request(app).post("/auth/register").send({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "test@example.com",
      phone: "+33123456789",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");
  });

  it("POST /auth/register → retourne 400 si champs manquants", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.errors).toBeDefined();
  });

  it("POST /auth/register → retourne 400 si email invalide", async () => {
    const res = await request(app).post("/auth/register").send({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "invalidemail",
      phone: "+33123456789",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.email).toMatch(/not a valid email/i);
  });

  it("POST /auth/register → retourne 400 si téléphone invalide", async () => {
    const res = await request(app).post("/auth/register").send({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "test2@example.com",
      phone: "1234",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.phone).toMatch(/not a valid phone/i);
  });

  it("POST /auth/register → retourne 403 si email déjà utilisé", async () => {
    const hash = await bcrypt.hash("password123", 10);
    await User.create({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "dup@example.com",
      phone: "+33987654321",
      password: hash,
    });

    const res = await request(app).post("/auth/register").send({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "dup@example.com",
      phone: "+33123456789",
      password: "newpassword",
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Email or Phone already in use");
  });

  // --- LOGIN ---
  it("POST /auth/login → connecte un utilisateur existant", async () => {
    const hash = await bcrypt.hash("password123", 10);
    await User.create({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "login@example.com",
      phone: "+33123456789",
      password: hash,
    });

    const res = await request(app).post("/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.userName).toBe("Sofia");
  });

  it("POST /auth/login → retourne 400 si email manquant", async () => {
    const res = await request(app).post("/auth/login").send({
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User email required");
  });

  it("POST /auth/login → retourne 400 si mot de passe manquant", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "login@example.com",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User password required");
  });

  it("POST /auth/login → retourne 401 si mot de passe incorrect", async () => {
    const hash = await bcrypt.hash("password123", 10);
    await User.create({
      firstname: "Sofia",
      lastname: "Hazami",
      email: "wrongpass@example.com",
      phone: "+33123456789",
      password: hash,
    });

    const res = await request(app).post("/auth/login").send({
      email: "wrongpass@example.com",
      password: "badpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Incorrect Login/Password");
  });

  it("POST /auth/login → retourne 401 si utilisateur inexistant", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ghost@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Incorrect Login/Password");
  });
});
