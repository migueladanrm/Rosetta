using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Rosetta.Orchestrator;
using Rosetta.Orchestrator.WorkerTelemetry;
using System;
using System.Text;
using System.Threading;
using static Rosetta.Orchestrator.ConnectionManager;
using static Rosetta.Orchestrator.SettingsManager;
using static Rosetta.Orchestrator.Telemetry.Logger;

Log("Inicializando Rosetta Orchestrator para Pyxel...");

LoadSettings();

var wsw = new WorkerStatusWatcher();

const string EXCHANGE_NAME = "XPyxel";
const string QUEUE_NAME = "pyxel-orchestrator";

using var connection = GetRabbitMQConnectionFactory().CreateConnection();
using var channel = connection.CreateModel();
channel.ExchangeDeclare(exchange: EXCHANGE_NAME, type: ExchangeType.Direct, durable: true);
channel.QueueBind(queue: QUEUE_NAME, exchange: EXCHANGE_NAME, routingKey: "");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, e) => {
    Log("Mensaje recibido. Procediendo a asignación de tareas...");
        
    var rawMessage = Encoding.UTF8.GetString(e.Body.ToArray());
    var json = JObject.Parse(rawMessage);

    Console.WriteLine(" [x] {0}", rawMessage);
};
channel.BasicConsume(queue: QUEUE_NAME, autoAck: true, consumer: consumer);

Log("Orchestrator está listo. Esperando mensajes...");
Console.ReadKey();