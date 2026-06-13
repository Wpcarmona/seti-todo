import { inject, Injectable } from '@angular/core';
import { CategoryRepository } from '../../../infrastructure/repositories/category-repository';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class UpdateCategoryUseCase {
  private repo = inject(CategoryRepository);

  execute(category: Category): Promise<void> {
    return this.repo.update(category);
  }
}
