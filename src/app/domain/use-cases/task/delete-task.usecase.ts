import { inject, Injectable } from '@angular/core';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';

@Injectable({ providedIn: 'root' })
export class DeleteTaskUseCase {
  private repo = inject(TASK_REPOSITORY);

  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
