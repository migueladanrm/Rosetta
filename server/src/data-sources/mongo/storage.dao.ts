import { Readable } from "stream";
import { OperationItem } from "../../models/operation-item.model";
import { StorageRepository } from "../../repositories/storage.repository";
import { getMongoStorage } from "./mongo-connection-manager";

export class StorageDao implements StorageRepository {
  async addFiles(files: Express.Multer.File[]): Promise<OperationItem[]> {
    const fs = await getMongoStorage();
    const output: OperationItem[] = [];

    for (const f of files) {
      const readable = new Readable();
      readable._read = () => {};
      readable.push(f.buffer);
      readable.push(null);

      const obj = await fs.writeFileStream(readable, {
        filename: f.originalname,
        contentType: f.mimetype,
      });

      output.push({
        id: obj._id.toHexString(),
        filename: obj.filename,
        length: obj.length,
        contentType: obj.contentType,
      } as OperationItem);
    }

    return output;
  }
}
