import { read } from "fs";
import { Readable } from "stream";
import { StorageRepository } from "../../repositories/storage.repository";
import { getMongoStorage } from "./mongo-connection-manager";

export class StorageDao implements StorageRepository {
  async addFiles(files: Express.Multer.File[]): Promise<any> {
    const fs = await getMongoStorage();
    const output: any = [];

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
        id: obj._id,
        filename: obj.filename,
        length: obj.length,
      });
    }

    return output;
  }
}
