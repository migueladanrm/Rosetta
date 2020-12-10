export interface QueueRepository {
  sendToOrchestrator(operationId: string): Promise<any>;
}
