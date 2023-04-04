import { Request, Response } from "express";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";
import { container } from "tsyringe";

enum OperationType {
  TRANSFER = "transfer",
}

class CreateTransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateTransferStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type: OperationType.TRANSFER,
      amount,
      description,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}

export { CreateTransferStatementController };
