import { inject, Injectable } from '@angular/core';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  private repo = inject(TASK_REPOSITORY);

  async execute(title: string, categoryId: string | null): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };
    await this.repo.save(task);
    return task;
  }
}
