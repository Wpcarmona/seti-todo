import { inject, Injectable } from '@angular/core';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class UpdateCategoryUseCase {
  private repo = inject(CATEGORY_REPOSITORY);

  execute(category: Category): Promise<void> {
    return this.repo.update(category);
  }
}
