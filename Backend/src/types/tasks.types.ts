
import { Document, Types } from "mongoose";

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface ITask extends Document {
  user: Types.ObjectId; 
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
