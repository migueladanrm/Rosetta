using Newtonsoft.Json.Linq;
using Npgsql;
using RabbitMQ.Client;
using System.Collections.Generic;
using System.Text;
using static Rosetta.Orchestrator.ConnectionManager;
using static Rosetta.Orchestrator.Telemetry.Logger;

namespace Rosetta.Orchestrator.Operations
{
    public class WorkerNotificationHandler
    {
        private const string EXCHANGE_NAME = "XPyxel-Nodes";

        private List<string> workers = new List<string>();
        private IConnection rabbitmq;
        private IModel channel;

        public WorkerNotificationHandler() {
            Log("Inicializando notificador de nodos...");
            Setup();
        }

        private void Setup() {
            Worker.GetWorkers().ForEach(w => workers.Add(w.Id));

            rabbitmq = GetRabbitMQConnectionFactory().CreateConnection();
            channel = rabbitmq.CreateModel();

            channel.ExchangeDeclare(exchange: EXCHANGE_NAME, type: ExchangeType.Direct, durable: true);
            foreach (var w in workers)
                channel.QueueBind(queue: w, exchange: EXCHANGE_NAME, routingKey: "");

            Log("Rosetta Orchestrator está listo para notificar a los nodos cuando sea necesario.");
        }

        public void NotifyWorkers(JObject message) {
            Log($"Notificando nodos para operación '{message["operation"]}'...");

            var props = channel.CreateBasicProperties();
            props.Persistent = true;
            channel.BasicPublish(exchange: EXCHANGE_NAME, routingKey: "", basicProperties: props, Encoding.UTF8.GetBytes(message.ToString()));

            Log("Se han notificado los nodos.");
        }
    }
}