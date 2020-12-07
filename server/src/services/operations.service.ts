import { Operation } from "../models/operation.model";
import { OperationsRepository } from "../repositories/operations.repository";

export class OperationsService {
  constructor(private repository: OperationsRepository) {}

  async createOperation(operation: Operation): Promise<Operation> {
    const result = await this.repository.addOperation(operation);
    return result;
  }
}
