import { OperationTask } from "../../models/operation-task.model";
import { Operation } from "../../models/operation.model";
import { OperationsRepository } from "../../repositories/operations.repository";
import { PostgresConnectionManager } from "./postgres-connection-manager";

export class OperationsDao implements OperationsRepository {
  async addOperation(operation: Operation): Promise<Operation> {
    const pg = await PostgresConnectionManager.getPool().connect();
    const queryResult = await pg.query(
      "INSERT INTO public.operation(description, items, filters) VALUES($1, $2::jsonb, $3::jsonb) RETURNING *;",
      [
        operation.description,
        JSON.stringify(operation.items),
        JSON.stringify(operation.filters),
      ]
    );

    pg.release();

    return this.formatOperation(queryResult.rows[0]);
  }

  async getDoneOperations(limit: number): Promise<Operation[]> {
    return this.queryOperations(
      "SELECT * FROM public.operation WHERE is_done = true ORDER BY creation DESC LIMIT $1;",
      [limit]
    );
  }

  async getOperation(id: string): Promise<Operation> {
    const pg = await PostgresConnectionManager.getPool().connect();
    const queryResult = await pg.query(
      "SELECT * FROM public.operation WHERE id = $1;",
      [id]
    );

    pg.release();

    if (0 < queryResult.rowCount) {
      return this.formatOperation(queryResult.rows[0]);
    }

    return undefined;
  }

  async getOperationTasks(operationId: string): Promise<OperationTask[]> {
    const pg = await PostgresConnectionManager.getPool().connect();
    const queryResult = await pg.query(
      "SELECT * FROM public.operation_task WHERE operation = $1;",
      [operationId]
    );

    pg.release();

    return queryResult.rows.map(this.formatOperationTask);
  }

  async getPendingOperations(limit: number): Promise<Operation[]> {
    return this.queryOperations(
      "SELECT * FROM public.operation WHERE is_done = false ORDER BY creation DESC LIMIT $1;",
      [limit]
    );
  }

  async getOperations(limit: number): Promise<Operation[]> {
    return this.queryOperations(
      "SELECT * FROM public.operation ORDER BY creation DESC LIMIT $1;",
      [limit]
    );
  }

  private async queryOperations(
    sql: string,
    params: string[] | any[]
  ): Promise<Operation[]> {
    const pg = await PostgresConnectionManager.getPool().connect();
    const queryResult = await pg.query(sql, params);

    pg.release();

    return queryResult.rows.map(this.formatOperation);
  }

  private formatOperation(row: any): Operation {
    return {
      id: row.id,
      description: row.description,
      creation: row.creation,
      filters: row.filters,
      isDone: row.is_done,
      items: row.items,
    } as Operation;
  }

  private formatOperationTask(row: any): OperationTask {
    return {
      id: row.id,
      operation: row.operation,
      fileId: row.file_id,
      filter: row.filter,
      assignedWorker: row.assigned_worker,
      assignedAt: row.assigned_at,
      finishedAt: row.finished_at,
      outputFile: row.output_file,
    } as OperationTask;
  }
}
