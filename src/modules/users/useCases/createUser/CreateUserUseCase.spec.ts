import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user who already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test Name",
        email: "test@test.com",
        password: "test_password",
      });

      const user = await createUserUseCase.execute({
        name: "Test Name",
        email: "test@test.com",
        password: "test_password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
