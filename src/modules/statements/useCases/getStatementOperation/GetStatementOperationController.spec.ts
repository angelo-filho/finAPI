import request from "supertest";
import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to responds with the statement data", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Angelo",
      email: "test@test.com",
      password: "test",
    });

    const tokenResponse = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "test@test.com", password: "test" });

    const { token } = tokenResponse.body;

    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "test description",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .get(`/api/v1/statements/${statementResponse.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
