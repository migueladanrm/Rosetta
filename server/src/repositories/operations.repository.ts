import { Operation } from "../models/operation.model";

export interface OperationsRepository {
  addOperation(operation: Operation): Promise<Operation>;
}
