import { OperationItem } from "../models/operation-item.model";

export interface StorageRepository {
  addFiles(files: Express.Multer.File[]): Promise<OperationItem[]>;
}
