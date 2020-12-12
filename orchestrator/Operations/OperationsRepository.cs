using Newtonsoft.Json.Linq;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using static Rosetta.Orchestrator.ConnectionManager;

namespace Rosetta.Orchestrator.Operations
{
    public class OperationsRepository
    {
        public void AssignOperationTask(string operationTaskId, string workerId) {
            using var connection = GetDatabaseConnection();
            using var command = new NpgsqlCommand("UPDATE public.operation_task SET assigned_worker = @worker_id, assigned_at = NOW() WHERE id = @operation_id;", connection);
            command.Parameters.Add("@operation_id", NpgsqlDbType.Uuid).Value = Guid.Parse(operationTaskId);
            command.Parameters.Add("@worker_id", NpgsqlDbType.Varchar).Value = workerId;

            command.ExecuteNonQuery();
        }

        public Operation GetOperation(string id) {
            using var connection = GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT * FROM public.operation WHERE id = @id LIMIT 1;", connection);
            command.Parameters.Add("@id", NpgsqlDbType.Uuid).Value = Guid.Parse(id);
            using var reader = command.ExecuteReader();
            if (reader.Read())
                return new Operation {
                    Id = Guid.Parse(reader["id"].ToString()),
                    Creation = (DateTime)reader["creation"],
                    Description = reader["description"] is not DBNull ? (string)reader["description"] : null,
                    Filters = JArray.Parse((string)reader["filters"]),
                    IsDone = (bool)reader["is_done"],
                    Items = JArray.Parse((string)reader["items"])
                };

            return null;
        }

        public List<OperationTask> GetOperationTasks(string operationId) {
            using var connection = GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT * FROM public.operation_task WHERE operation = @operation_id;", connection);
            command.Parameters.Add("@operation_id", NpgsqlDbType.Uuid).Value = Guid.Parse(operationId);
            using var reader = command.ExecuteReader();

            var tasks = new List<OperationTask>();

            while (reader.Read())
                tasks.Add(ParseOperationTask(reader));

            return tasks;
        }

        public List<OperationTask> GetPendingOperationTasks() {
            using var connection = GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT * FROM public.operation_task WHERE finished_at IS NULL;", connection);
            using var reader = command.ExecuteReader();

            var tasks = new List<OperationTask>();

            while (reader.Read())
                tasks.Add(ParseOperationTask(reader));

            return tasks;
        }

        private static OperationTask ParseOperationTask(NpgsqlDataReader reader) {
            if (reader == null)
                throw new ArgumentNullException(nameof(reader));

            return new OperationTask {
                Id = Guid.Parse(reader["id"].ToString()),
                Operation = Guid.Parse(reader["operation"].ToString()),
                FileId = (string)reader["file_id"],
                Filter = (string)reader["filter"],
                AssignedWorker = reader["assigned_worker"] is not DBNull ? (string)reader["assigned_worker"] : null,
                AssignedAt = reader["assigned_at"] is not DBNull ? (DateTime)reader["assigned_at"] : null,
                FinishedAt = reader["finished_at"] is not DBNull ? (DateTime)reader["finished_at"] : null,
                OutputFile = reader["output_file"] is not DBNull ? (string)reader["output_file"] : null,
            };
        }
    }
}