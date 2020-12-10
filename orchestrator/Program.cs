using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Rosetta.Orchestrator;
using Rosetta.Orchestrator.WorkerTelemetry;
using System;
using System.Text;
using System.Threading;
using static Rosetta.Orchestrator.SettingsManager;
using static Rosetta.Orchestrator.Telemetry.Logger;

Log("Inicializando orquestador de Rosetta...");

SettingsManager.LoadSettings();

var wsw = new WorkerStatusWatcher();

while(true) {
    Thread.Sleep(2500);
    Console.WriteLine(wsw.RetrieveCurrentWorkersStats()[0]);
    Console.WriteLine();
}

var factory = new ConnectionFactory {
    Uri = new Uri(GetSetting(OrchestratorSettings.RabbitMqUrl))
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.ExchangeDeclare(exchange: "XPyxel", type: ExchangeType.Direct, durable: true);

var queueName = channel.QueueDeclare().QueueName;
channel.QueueBind(queue: queueName, exchange: "XPyxel", routingKey: "");

Console.WriteLine(" [*] Waiting for logs.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) => {
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine(" [x] {0}", message);
};
channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine(); 
