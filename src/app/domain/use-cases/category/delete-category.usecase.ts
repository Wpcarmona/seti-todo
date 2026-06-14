import { inject, Injectable } from '@angular/core';
import { CategoryRepository } from '../../../infrastructure/repositories/category-repository';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryUseCase {
  private repo = inject(CategoryRepository);

  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
