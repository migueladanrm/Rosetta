import { StorageFile } from "../models/storage-file.model";

export interface StorageRepository {
  addFiles(files: Express.Multer.File[]): Promise<StorageFile[]>;
}
