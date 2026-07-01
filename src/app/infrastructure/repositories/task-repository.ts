 import { inject, Injectable } from '@angular/core';
  import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';
  import { Task } from '../../domain/models/task.model';
  import { StorageService } from '../services/storage';

  @Injectable()
  export class TaskRepository implements ITaskRepository {
    private storage = inject(StorageService);
    private readonly KEY = 'tasks';

    async getAll(): Promise<Task[]> {
      return (await this.storage.get<Task[]>(this.KEY)) ?? [];
    }

    async save(task: Task): Promise<void> {
      const tasks = await this.getAll();
      await this.storage.set(this.KEY, [...tasks, task]);
    }

    async update(task: Task): Promise<void> {
      const tasks = await this.getAll();
      await this.storage.set(
        this.KEY,
        tasks.map(t => (t.id === task.id ? task : t))
      );
    }

    async delete(id: string): Promise<void> {
      const tasks = await this.getAll();
      await this.storage.set(this.KEY, tasks.filter(t => t.id !== id));
    }
  }