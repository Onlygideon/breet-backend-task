import request from "supertest";
import app from "../app.js";
import { connectMongodb } from "../db/mongo.js";
import User from "../modules/user/user.model.js";

const waitForAppReady = (delay = 2000) => new Promise((resolve) => setTimeout(resolve, delay));

describe("POST - create User", () => {
  beforeAll(async () => {
    await connectMongodb();
    await waitForAppReady(3000);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should create a new user successfully", async () => {
    const newUser = {
      username: "breetUser",
      password: "Breet@2025",
      userType: "individual",
    };

    const res = await request(app).post(`/v1/user/register`).send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.data).toBe("User Signed Up Successfully!");
  });

  it("should fail to create user with invalid password", async () => {
    const newUser = {
      username: "baduser",
      password: "invalid-password",
      userType: "individual",
    };

    const res = await request(app).post(`/v1/user/register`).send(newUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Password must contain at least one uppercase, lowercase, character and number"
    );
  });

  it("should fail to create user with invalid username", async () => {
    const newUser = {
      username: "1invalidUsername",
      password: "Valid@1234",
      userType: "individual",
    };

    const res = await request(app).post(`/v1/user/register`).send(newUser);

    expect(res.status).toBe(400);
  });
});
