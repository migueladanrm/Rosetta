import { IGridFSObject } from "mongo-gridfs";
import { OperationItem } from "../models/operation-item.model";
import { GridFSBucketReadStream } from "mongodb";

export interface StorageRepository {
  addFiles(files: Express.Multer.File[]): Promise<OperationItem[]>;

  getFile(
    id: string
  ): Promise<{ metadata: IGridFSObject; payload: GridFSBucketReadStream }>;
}
