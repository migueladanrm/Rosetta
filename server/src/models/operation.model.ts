import { OperationItem } from "./operation-item.model";

export interface Operation {
  id: string;
  description: string;
  items: OperationItem[];
  filters: string[];
  isDone: boolean;
  creation: Date;
}
