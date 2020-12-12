using Npgsql;
using System.Collections.Generic;
using static Rosetta.Orchestrator.ConnectionManager;

namespace Rosetta.Orchestrator.Operations
{
    public class Worker
    {
        public Worker() {

        }

        public string Id { get; set; }
        public string Name { get; set; }

        public static List<Worker> GetWorkers() {
            var workers = new List<Worker>();
            using var connection = GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT * FROM public.worker;", connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
                workers.Add(new Worker {
                    Id = (string)reader["id"],
                    Name = (string)reader["name"]
                });
            return workers;
        }
    }
}