import { inject, Injectable } from '@angular/core';
import { TaskRepository } from '../../../infrastructure/repositories/task-repository';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class UpdateTaskUseCase {
  private repo = inject(TaskRepository);

  execute(task: Task): Promise<void> {
    return this.repo.update(task);
  }
}
