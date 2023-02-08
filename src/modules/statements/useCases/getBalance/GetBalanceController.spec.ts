import request from "supertest";

import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to respond the data of user's balance", async () => {
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
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });
});
