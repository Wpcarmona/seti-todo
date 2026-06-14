import { inject, Injectable } from '@angular/core';
import { CategoryRepository } from '../../../infrastructure/repositories/category-repository';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {
  private repo = inject(CategoryRepository);

  async execute(name: string, color: string): Promise<Category> {
    const category: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now(),
    };
    await this.repo.save(category);
    return category;
  }
}
