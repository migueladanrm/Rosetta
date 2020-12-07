import { Request, Response, Router } from "express";
import { Operation } from "../models/operation.model";
import { OperationsService } from "../services/operations.service";
import { StorageService } from "../services/storage.service";

export function OperationsRoute(
  operations: OperationsService,
  storage: StorageService
): Router {
  return Router().post(
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
  );
}
