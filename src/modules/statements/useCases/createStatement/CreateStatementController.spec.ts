import request from "supertest";
import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create a deposit statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Angelo",
      email: "test@test.com",
      password: "test",
    });

    const tokenResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "test@test.com", password: "test" });

    const { token } = tokenResponse.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "test description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able create a withdraw statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Angelo",
      email: "test@test.com",
      password: "test",
    });

    const tokenResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "test@test.com", password: "test" });

    const { token } = tokenResponse.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "test description",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 300,
        description: "test description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("withdraw");
  });
});
