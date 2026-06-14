import { Category } from './category.model';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;
}

export interface TaskWithCategory extends Task {
    category: Category | null;
  }