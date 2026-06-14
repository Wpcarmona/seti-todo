import { inject, Injectable } from '@angular/core';
import { CategoryRepository } from '../../../infrastructure/repositories/category-repository';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class GetCategoriesUseCase {
  private repo = inject(CategoryRepository);

  execute(): Promise<Category[]> {
    return this.repo.getAll();
  }
}
