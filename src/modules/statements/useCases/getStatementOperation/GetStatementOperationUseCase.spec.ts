import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

const test_user = {
  name: "test",
  email: "test@test.com",
  password: "test_password",
};

describe("Get statement operation", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatement = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute(test_user);

    const test_statement: ICreateStatementDTO = {
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "description test",
    };

    const statement_mocked = await createStatement.execute(test_statement);

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement_mocked.id!,
    });

    expect(statement).toMatchObject(statement_mocked);
  });

  it("should not be able to get statement operation with a non-existent user", () => {
    expect(async () => {
      const test_statement: ICreateStatementDTO = {
        user_id: "valid_id",
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "description test",
      };

      const statement_mocked = await createStatement.execute(test_statement);

      await getStatementOperationUseCase.execute({
        user_id: "invalid_id",
        statement_id: statement_mocked.id!,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get statement operation of a non-existent statement", () => {
    expect(async () => {
      const test_user = {
        name: "test",
        email: "test@test.com",
        password: "test_password",
      };

      const user = await createUserUseCase.execute(test_user);

      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "invalid_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
