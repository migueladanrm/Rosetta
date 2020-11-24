import { Request, Response, Router } from "express";
import * as Amqp from "amqp-ts";

export function TestsRoute(): Router {
  return Router().post("/queue-test", async (req: Request, res: Response) => {
    var connection = new Amqp.Connection(process.env.SERVER_RABBITMQ_URL);
    var exchange = connection.declareExchange("XPyxel");
    var queue = connection.declareQueue("pyxel-01", {
      durable: true,
    });
    queue.bind(exchange);
    queue.activateConsumer((message) => {
      console.log("Message received: " + message.getContent());
    });

    // it is possible that the following message is not received because
    // it can be sent before the queue, binding or consumer exist
    //var msg = new Amqp.Message("Test");
    //exchange.send(msg);

    connection.completeConfiguration().then(() => {
      // the following message will be received because
      // everything you defined earlier for this connection now exists
      var msg2 = new Amqp.Message("Test2");
      exchange.send(msg2);
    });
    res.sendStatus(200);
  });
}
