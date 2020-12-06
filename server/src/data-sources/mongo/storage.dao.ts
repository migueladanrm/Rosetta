import { Readable } from "stream";
import { StorageFile } from "../../models/storage-file.model";
import { StorageRepository } from "../../repositories/storage.repository";
import { getMongoStorage } from "./mongo-connection-manager";

export class StorageDao implements StorageRepository {
  async addFiles(files: Express.Multer.File[]): Promise<StorageFile[]> {
    const fs = await getMongoStorage();
    const output: StorageFile[] = [];

    for (const f of files) {
      const readable = new Readable();
      readable._read = () => {};
      readable.push(f.buffer);
      readable.push(null);

      const obj = await fs.writeFileStream(f.stream, {
        filename: f.originalname,
        contentType: f.mimetype,
      });

      output.push({
        id: obj._id.toHexString(),
        filename: obj.filename,
        length: obj.length,
        contentType: obj.contentType,
      } as StorageFile);
    }

    return output;
  }
}
