import { inject, Injectable } from '@angular/core';
import { TaskRepository } from '../../../infrastructure/repositories/task-repository';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class GetTasksUseCase {
  private repo = inject(TaskRepository);

  execute(): Promise<Task[]> {
    return this.repo.getAll();
  }
}
