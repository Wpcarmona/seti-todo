import { inject, Injectable } from '@angular/core';
import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';
import { Task } from '../../domain/models/task.model';
import { SyncStatus } from '../../domain/models/sync-status.enum';
import { StorageService } from '../services/storage';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { ConnectivityService } from '../services/connectivity.service';

@Injectable()
export class TaskRepository implements ITaskRepository {
  private storage = inject(StorageService);
  private firestoreDs = inject(FirestoreDatasource);
  private connectivity = inject(ConnectivityService);
  private readonly KEY = 'tasks';

  async getAll(userId: string): Promise<Task[]> {
    const all = (await this.storage.get<Task[]>(this.KEY)) ?? [];
    return all.filter(t => t.userId === userId && t.syncStatus !== SyncStatus.DELETED);
  }

  async getAllRaw(): Promise<Task[]> {
    return (await this.storage.get<Task[]>(this.KEY)) ?? [];
  }

  async save(task: Task): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, [...all, task]);

    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.saveTask(task);
        await this.updateSyncStatus(task.id, SyncStatus.SYNCED);
      } catch {}
    }
  }

  async update(task: Task): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(t => t.id === task.id ? task : t));

    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.saveTask(task);
        await this.updateSyncStatus(task.id, SyncStatus.SYNCED);
      } catch {}
    }
  }

  async delete(id: string): Promise<void> {
    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.deleteTask(id);
        await this.hardDelete(id);
        return;
      } catch {}
    }
    await this.updateSyncStatus(id, SyncStatus.DELETED);
  }

  async getPending(userId: string): Promise<Task[]> {
    const all = await this.getAllRaw();
    return all.filter(t => t.userId === userId && t.syncStatus === SyncStatus.PENDING);
  }

  async getPendingDeletions(userId: string): Promise<Task[]> {
    const all = await this.getAllRaw();
    return all.filter(t => t.userId === userId && t.syncStatus === SyncStatus.DELETED);
  }

  async updateSyncStatus(id: string, status: SyncStatus): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(t => t.id === id ? { ...t, syncStatus: status } : t));
  }

  async hardDelete(id: string): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.filter(t => t.id !== id));
  }

  async saveRaw(task: Task): Promise<void> {
    const all = await this.getAllRaw();
    if (all.find(t => t.id === task.id)) return;
    await this.storage.set(this.KEY, [...all, task]);
  }

  async updateRaw(task: Task): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(t => t.id === task.id ? task : t));
  }
}
