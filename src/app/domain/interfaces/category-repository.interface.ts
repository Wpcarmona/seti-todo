import { Category } from '../models/category.model';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
