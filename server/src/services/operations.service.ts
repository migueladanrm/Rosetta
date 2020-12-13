import { OperationTask } from "../models/operation-task.model";
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

  async getOperation(id: string): Promise<Operation> {
    return await this.repository.getOperation(id);
  }

  async getOperations(limit: number): Promise<Operation[]> {
    return await this.repository.getOperations(limit);
  }

  async getOperationTasks(operationId: string): Promise<OperationTask[]> {
    if ((await this.getOperation(operationId)) == undefined) {
      return undefined;
    }

    return this.repository.getOperationTasks(operationId);
  }
}
