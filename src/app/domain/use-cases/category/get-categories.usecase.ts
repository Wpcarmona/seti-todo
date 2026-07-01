import { inject, Injectable } from '@angular/core';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class GetCategoriesUseCase {
  private repo = inject(CATEGORY_REPOSITORY);

  execute(): Promise<Category[]> {
    return this.repo.getAll();
  }
}
