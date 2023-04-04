import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";
import { CreateStatementError } from "../createStatement/CreateStatementError";

@injectable()
class CreateTransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    type,
    user_id,
    sender_id,
  }: ICreateTransferStatementDTO) {
    if (user_id === sender_id) {
      throw new CreateStatementError.SameUserError();
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id!,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return statementOperation;
  }
}

export { CreateTransferStatementUseCase };
