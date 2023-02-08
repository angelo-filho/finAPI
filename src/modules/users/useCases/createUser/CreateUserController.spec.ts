import request from "supertest";
import { Connection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = getConnection();

    await connection.connect();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Angelo",
      email: "tese@test.com",
      password: "test",
    });

    expect(response.status).toBe(201);
  });
});
