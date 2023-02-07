import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

describe("Get balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get user balance", async () => {
    const test_user = {
      name: "test",
      email: "test@test.com",
      password: "test_password",
    };

    const user = await createUserUseCase.execute(test_user);

    const balance = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get the balance of a user who doesn't exist", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "invalid_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
