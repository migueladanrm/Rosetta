import { Request, Response, Router } from "express";
import { Operation } from "../models/operation.model";
import { OperationsService } from "../services/operations.service";
import { StorageService } from "../services/storage.service";

export function OperationsRoute(
  operations: OperationsService,
  storage: StorageService
): Router {
  return Router()
    .get("/", async (req: Request, res: Response) => {
      const limit: number =
        req.query.limit == undefined
          ? 50
          : Number.parseInt(req.query.limit as string);
      const latestOperations = await operations.getOperations(limit);
      res.status(200).json(latestOperations);
    })
    .post(
      "/create",
      storage.getUploader().array("images", 10),
      async (req: Request, res: Response) => {
        const files = req.files;
        const settings = JSON.parse(req.body.settings);

        if (!files) {
          res.status(400).json({ error: "Must provide at least one picture." });
        } else {
          const items = await storage.saveFiles(files as Express.Multer.File[]);
          const operation = await operations.createOperation({
            description: settings.description,
            filters: settings.filters,
            items: items,
          } as Operation);

          res.status(201).json(operation);
        }
      }
    )
    .get("/:id", async (req: Request, res: Response) => {
      const operationId = req.params.id;
      if (operationId != undefined) {
        const operation = await operations.getOperation(operationId);
        if (operationId != undefined) {
          res.status(200).json(operation);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(400);
      }
    })
    .get("/:id/tasks", async (req: Request, res: Response) => {
      const operationId = req.params.id;
      if (operationId != undefined) {
        const operation = await operations.getOperationTasks(operationId);
        if (operationId != undefined) {
          res.status(200).json(operation);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(400);
      }
    });
}
