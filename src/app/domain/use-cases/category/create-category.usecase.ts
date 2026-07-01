import { inject, Injectable } from '@angular/core';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';
import { SyncStatus } from '../../models/sync-status.enum';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {
  private repo = inject(CATEGORY_REPOSITORY);

  async execute(name: string, color: string, userId: string): Promise<Category> {
    const category: Category = {
      id: crypto.randomUUID(),
      userId,
      name,
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: SyncStatus.PENDING,
    };
    await this.repo.save(category);
    return category;
  }
}
