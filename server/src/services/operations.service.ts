import { Operation } from "../models/operation.model";
import { OperationsRepository } from "../repositories/operations.repository";
import { QueueRepository } from "../repositories/queue.repository";

export class OperationsService {
  constructor(
    private repository: OperationsRepository,
    private queueRepository: QueueRepository
  ) {}

  async createOperation(operation: Operation): Promise<Operation> {
    const result = await this.repository.addOperation(operation);
    await this.queueRepository.sendToOrchestrator(result.id);
    return result;
  }
}
