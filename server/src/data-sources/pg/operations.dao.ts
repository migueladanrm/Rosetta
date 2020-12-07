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

    return queryResult.rows[0] as Operation;
  }
}
