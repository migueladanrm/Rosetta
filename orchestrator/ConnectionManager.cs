using Npgsql;
using RabbitMQ.Client;
using System;
using System.Threading.Tasks;

namespace Rosetta.Orchestrator
{
    public class ConnectionManager
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

        public static ConnectionFactory GetRabbitMQConnectionFactory() {
            return new ConnectionFactory {
                Uri = new Uri(Environment.GetEnvironmentVariable("ORCHESTRATOR_RABBITMQ_URL")),
                NetworkRecoveryInterval = TimeSpan.FromSeconds(30)
            };
        }
    }
}