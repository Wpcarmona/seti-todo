import { Task } from '../models/task.model';

export interface ITaskRepository {
  getAll(userId: string): Promise<Task[]>;
  save(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}

 