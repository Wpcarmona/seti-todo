import { inject, Injectable } from '@angular/core';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryUseCase {
  private repo = inject(CATEGORY_REPOSITORY);

  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
