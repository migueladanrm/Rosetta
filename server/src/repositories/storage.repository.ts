export interface StorageRepository {
  addFiles(files: Express.Multer.File[]): Promise<any>;
}
