import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

const test_user = {
  name: "test",
  email: "test@test.com",
  password: "test_password",
};

describe("Create statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user = await createUserUseCase.execute(test_user);

    const test_statement: ICreateStatementDTO = {
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "description test",
    };

    const statement = await createStatementUseCase.execute(test_statement);

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a withdraw statement if user have sufficient balance", async () => {
    const user = await createUserUseCase.execute(test_user);

    const test_deposit_statement: ICreateStatementDTO = {
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "deposit test",
    };

    const test_withdraw_statement: ICreateStatementDTO = {
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 300,
      description: "withdraw test",
    };

    await createStatementUseCase.execute(test_deposit_statement);

    const statement = await createStatementUseCase.execute(
      test_withdraw_statement
    );

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a statement with a non-existent user", () => {
    expect(async () => {
      const test_statement: ICreateStatementDTO = {
        user_id: "wrong id",
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "description test",
      };

      await createStatementUseCase.execute(test_statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw statement if the user have insufficient balance", () => {
    expect(async () => {
      const user = await createUserUseCase.execute(test_user);

      const test_statement: ICreateStatementDTO = {
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 300,
        description: "description test",
      };

      await createStatementUseCase.execute(test_statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
