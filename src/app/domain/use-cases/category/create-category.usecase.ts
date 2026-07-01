import { inject, Injectable } from '@angular/core';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {
  private repo = inject(CATEGORY_REPOSITORY);

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
