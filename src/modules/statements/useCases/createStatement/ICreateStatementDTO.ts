import { Statement } from "../../entities/Statement";

type ICreateStatement = Pick<
  Statement,
  "user_id" | "description" | "amount" | "type"
>;

export interface ICreateStatementDTO extends ICreateStatement {
  sender_id?: string;
}
