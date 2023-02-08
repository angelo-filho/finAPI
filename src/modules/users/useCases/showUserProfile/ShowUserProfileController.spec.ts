import request from "supertest";
import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to responds with user data", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Angelo",
      email: "tese@test.com",
      password: "test",
    });

    const tokenResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "tese@test.com", password: "test" });

    const { token } = tokenResponse.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
