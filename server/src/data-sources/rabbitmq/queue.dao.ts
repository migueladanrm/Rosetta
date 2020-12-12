import { QueueRepository } from "../../repositories/queue.repository";
import { Connection, Exchange, Message, Queue } from "amqp-ts";

export class QueueDao implements QueueRepository {
  private connection: Connection;
  private exchange: Exchange;
  private queue: Queue;

  constructor() {
    this.connection = new Connection(process.env.SERVER_RABBITMQ_URL);
    this.exchange = this.connection.declareExchange("XPyxel");
    this.queue = this.connection.declareQueue("pyxel-orchestrator", {
      durable: true,
    });
    this.queue.bind(this.exchange);
    this.connection.completeConfiguration().then(() => {
      console.log("Queue server is ready!");
    });
  }

  async sendToOrchestrator(operationId: string): Promise<any> {
    const msg = new Message(JSON.stringify({ operation: operationId }));
    this.exchange.send(msg);
  }
}
