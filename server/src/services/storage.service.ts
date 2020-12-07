import multer from "multer";
import { OperationItem } from "../models/operation-item.model";
import { StorageRepository } from "../repositories/storage.repository";

export class StorageService {
  constructor(private repository: StorageRepository) {}

  getUploader() {
    return multer({ storage: multer.memoryStorage() });
  }

  async saveFiles(files: Express.Multer.File[]): Promise<OperationItem[]> {
    const result = await this.repository.addFiles(files);
    return result;
  }
}
