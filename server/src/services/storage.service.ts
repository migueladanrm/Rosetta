import multer from "multer";
import { StorageFile } from "../models/storage-file.model";
import { StorageRepository } from "../repositories/storage.repository";

export class StorageService {
  constructor(private repository: StorageRepository) {}

  getUploader() {
    return multer({ storage: multer.memoryStorage() });
  }

  async saveFiles(files: Express.Multer.File[]): Promise<StorageFile[]> {
    const result = await this.repository.addFiles(files);
    return result;
  }
}
