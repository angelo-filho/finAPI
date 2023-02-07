import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

const test_user = {
  name: "test",
  email: "test@test.com",
  password: "test_password",
};

describe("Show user profile", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show a user profile infos", async () => {
    const created_user = await createUserUseCase.execute(test_user);

    const user = await showUserProfileUseCase.execute(
      created_user.id as string
    );

    expect(user).toHaveProperty("id");
  });

  it("should not be able to show a user profile infos if user doesn't exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("test_id" as string);
    }).rejects.toBeInstanceOf(AppError);
  });
});
