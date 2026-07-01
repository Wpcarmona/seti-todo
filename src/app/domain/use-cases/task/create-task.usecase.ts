import { inject, Injectable } from '@angular/core';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';
import { SyncStatus } from '../../models/sync-status.enum';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  private repo = inject(TASK_REPOSITORY);

  async execute(title: string, categoryId: string | null, userId: string): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      userId,
      title,
      completed: false,
      categoryId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: SyncStatus.PENDING,
    };
    await this.repo.save(task);
    return task;
  }
}
