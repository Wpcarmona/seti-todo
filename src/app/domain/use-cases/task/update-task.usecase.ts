import { inject, Injectable } from '@angular/core';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class UpdateTaskUseCase {
  private repo = inject(TASK_REPOSITORY);

  execute(task: Task): Promise<void> {
    return this.repo.update(task);
  }
}
