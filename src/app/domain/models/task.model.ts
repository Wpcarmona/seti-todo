import { Category } from './category.model';
import { SyncStatus } from './sync-status.enum';

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
}

export interface TaskWithCategory extends Task {
  category: Category | null;
}
