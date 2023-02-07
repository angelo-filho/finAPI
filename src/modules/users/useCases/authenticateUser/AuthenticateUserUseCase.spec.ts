import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

const test_user = {
  name: "test",
  email: "test@test.com",
  password: "test_password",
};

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate a user", async () => {
    await createUserUseCase.execute(test_user);

    const user_and_token = await authenticateUserUseCase.execute({
      email: test_user.email,
      password: test_user.password,
    });

    expect(user_and_token).toHaveProperty("user");
    expect(user_and_token).toHaveProperty("token");
  });

  it("should not be able to authenticate a user with incorrect email", () => {
    expect(async () => {
      await createUserUseCase.execute(test_user);

      await authenticateUserUseCase.execute({
        email: "wrong_email",
        password: test_user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate a user with incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute(test_user);

      await authenticateUserUseCase.execute({
        email: test_user.email,
        password: "wrong_password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
