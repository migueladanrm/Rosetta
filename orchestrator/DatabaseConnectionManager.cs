using Npgsql;
using System;
using System.Threading.Tasks;

namespace Rosetta.Orchestrator
{
    public class DatabaseConnectionManager
    {
        public static NpgsqlConnection GetDatabaseConnection() {
            var connection = new NpgsqlConnection(Environment.GetEnvironmentVariable("ORCHESTRATOR_POSTGRES_URL"));
            connection.Open();

            return connection;
        }

        public static async Task<NpgsqlConnection> GetDatabaseConnectionAsync() {
            var connection = new NpgsqlConnection(Environment.GetEnvironmentVariable("ORCHESTRATOR_POSTGRES_URL"));
            await connection.OpenAsync();

            return connection;
        }
    }
}