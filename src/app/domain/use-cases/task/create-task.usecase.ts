import { inject, Injectable } from '@angular/core';
import { TaskRepository } from '../../../infrastructure/repositories/task-repository';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  private repo = inject(TaskRepository);

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
