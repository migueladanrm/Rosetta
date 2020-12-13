import { Request, Response, Router } from "express";
import { StorageService } from "../services/storage.service";

export function FilesRoute(storage: StorageService): Router {
  return Router().get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    if (id != undefined) {
      const { metadata, payload } = await storage.getFile(id);
      if (!metadata) {
        res.sendStatus(404);
      }

      res.set({
        "Content-Type": metadata.contentType,
        "Content-Disposition": "filename=" + metadata.filename,
      });

      payload.pipe(res);
    } else {
      res.sendStatus(400);
    }
  });
}
