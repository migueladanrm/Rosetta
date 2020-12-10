import { QueueRepository } from "../repositories/queue.repository";

export class QueueService {
  constructor(private repository: QueueRepository) {}

  async sendOperationToOrchestrator(operationId: string): Promise<void> {
    await this.repository.sendToOrchestrator(operationId);
  }
}
