import { Request, Response, Router } from "express";
import { StorageService } from "../services/storage.service";

export function OperationsRoute(storage: StorageService): Router {
  return Router().post(
    "/create",
    storage.getUploader().array("images", 10),
    async (req: Request, res: Response) => {
      const files = req.files;

      if (!files) {
        res.status(400).json({ error: "Must provide at least one picture." });
      } else {
        const result = await storage.saveFiles(files as Express.Multer.File[]);
        res.status(201).json(result);
      }
    }
  );
}
