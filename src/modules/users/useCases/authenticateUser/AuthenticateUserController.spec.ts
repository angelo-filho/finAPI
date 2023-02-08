import request from "supertest";
import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

const user = {
  name: "Angelo",
  email: "tese@test.com",
  password: "test",
};

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user and respond with user basics data and token", async () => {
    await request(app).post("/api/v1/users").send(user);

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});
