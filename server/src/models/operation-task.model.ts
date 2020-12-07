export interface OperationTask {
  id: string;
  operation: string;
  fileId: string;
  filter: string;
  assignedWorker: string;
  assignedAt: Date;
  finishedAt: Date;
  outputFile: string;
}
