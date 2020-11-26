using System;
using static Rosetta.Orchestrator.Telemetry.Logger;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Rosetta.Orchestrator;
using static Rosetta.Orchestrator.SettingsManager;


Log("Inicializando orquestador de Rosetta...");

var factory = new ConnectionFactory {
    Uri = new Uri(GetSetting(OrchestratorSettings.RabbitMqUrl))
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.ExchangeDeclare(exchange: "XPyxel", type: ExchangeType.Direct,durable:true);

var queueName = channel.QueueDeclare().QueueName;
channel.QueueBind(queue: queueName, exchange: "XPyxel", routingKey: "");

Console.WriteLine(" [*] Waiting for logs.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) => {
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine(" [x] {0}", message);
};
channel.BasicConsume(queue: queueName,
                        autoAck: true,
                        consumer: consumer);

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();
