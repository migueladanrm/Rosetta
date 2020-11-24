import { Request, Response, Router } from "express";
import * as Amqp from "amqp-ts";

export function TestsRoute(): Router {
  return Router().post("/queue-test", async (req: Request, res: Response) => {
    res.sendStatus(200);
  });
}
