import { inject, Injectable } from '@angular/core';
import { TaskRepository } from '../../../infrastructure/repositories/task-repository';

@Injectable({ providedIn: 'root' })
export class DeleteTaskUseCase {
  private repo = inject(TaskRepository);

  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
