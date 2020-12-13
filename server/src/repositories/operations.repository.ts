import { OperationTask } from "../models/operation-task.model";
import { Operation } from "../models/operation.model";

export interface OperationsRepository {
  addOperation(operation: Operation): Promise<Operation>;

  getDoneOperations(limit: number): Promise<Operation[]>;

  getOperation(id: string): Promise<Operation>;

  getPendingOperations(limit: number): Promise<Operation[]>;

  getOperations(limit: number): Promise<Operation[]>;

  getOperationTasks(operationId: string): Promise<OperationTask[]>;
}
