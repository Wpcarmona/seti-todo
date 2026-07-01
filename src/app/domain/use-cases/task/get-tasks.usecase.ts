import { inject, Injectable } from '@angular/core';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class GetTasksUseCase {
  private repo = inject(TASK_REPOSITORY);

  execute(): Promise<Task[]> {
    return this.repo.getAll();
  }
}
