import { inject, Injectable } from '@angular/core';
  import { ICategoryRepository } from '../../domain/interfaces/category-repository.interface';
  import { Category } from '../../domain/models/category.model';
  import { StorageService } from '../services/storage';

  @Injectable()
  export class CategoryRepository implements ICategoryRepository {
    private storage = inject(StorageService);
    private readonly KEY = 'categories';

    async getAll(): Promise<Category[]> {
      return (await this.storage.get<Category[]>(this.KEY)) ?? [];
    }

    async save(category: Category): Promise<void> {
      const categories = await this.getAll();
      await this.storage.set(this.KEY, [...categories, category]);
    }

    async update(category: Category): Promise<void> {
      const categories = await this.getAll();
      await this.storage.set(
        this.KEY,
        categories.map(c => (c.id === category.id ? category : c))
      );
    }
  
    async delete(id: string): Promise<void> {
      const categories = await this.getAll();
      await this.storage.set(this.KEY, categories.filter(c => c.id !== id));
    }
  }

