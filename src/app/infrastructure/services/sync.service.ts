import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { TaskRepository } from '../repositories/task-repository';
import { CategoryRepository } from '../repositories/category-repository';
import { ConnectivityService } from './connectivity.service';
import { SyncStatus } from '../../domain/models/sync-status.enum';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private firestoreDs = inject(FirestoreDatasource);
  private taskRepo = inject(TaskRepository);
  private categoryRepo = inject(CategoryRepository);
  private connectivity = inject(ConnectivityService);

  readonly isSyncing$ = new BehaviorSubject<boolean>(false);

  async syncAll(userId: string): Promise<void> {
    if (!this.connectivity.isOnline()) return;
    this.isSyncing$.next(true);
    try {
      await Promise.all([
        this.syncTasks(userId),
        this.syncCategories(userId),
      ]);
      await Promise.all([
        this.downloadRemoteTasks(userId),
        this.downloadRemoteCategories(userId),
      ]);
    } finally {
      this.isSyncing$.next(false);
    }
  }

  private async syncTasks(userId: string): Promise<void> {
    const pending = await this.taskRepo.getPending(userId);
    for (const task of pending) {
      try {
        await this.firestoreDs.saveTask(task);
        await this.taskRepo.updateSyncStatus(task.id, SyncStatus.SYNCED);
      } catch {}
    }

    const deleted = await this.taskRepo.getPendingDeletions(userId);
    for (const task of deleted) {
      try {
        await this.firestoreDs.deleteTask(task.id);
      } catch {}
      await this.taskRepo.hardDelete(task.id);
    }
  }

  private async syncCategories(userId: string): Promise<void> {
    const pending = await this.categoryRepo.getPending(userId);
    for (const cat of pending) {
      try {
        await this.firestoreDs.saveCategory(cat);
        await this.categoryRepo.updateSyncStatus(cat.id, SyncStatus.SYNCED);
      } catch {}
    }

    const deleted = await this.categoryRepo.getPendingDeletions(userId);
    for (const cat of deleted) {
      try {
        await this.firestoreDs.deleteCategory(cat.id);
      } catch {}
      await this.categoryRepo.hardDelete(cat.id);
    }
  }

  private async downloadRemoteTasks(userId: string): Promise<void> {
    const remoteTasks = await this.firestoreDs.getTasks(userId);
    const localTasks = await this.taskRepo.getAllRaw();
    const localMap = new Map(localTasks.map(t => [t.id, t]));

    for (const remote of remoteTasks) {
      const local = localMap.get(remote.id);
      if (!local) {
        await this.taskRepo.saveRaw({ ...remote, syncStatus: SyncStatus.SYNCED });
      } else if (local.syncStatus === SyncStatus.DELETED) {
        continue;
      } else if (remote.updatedAt > local.updatedAt) {
        await this.taskRepo.updateRaw({ ...remote, syncStatus: SyncStatus.SYNCED });
      }
    }
  }

  private async downloadRemoteCategories(userId: string): Promise<void> {
    const remoteCategories = await this.firestoreDs.getCategories(userId);
    const localCategories = await this.categoryRepo.getAllRaw();
    const localMap = new Map(localCategories.map(c => [c.id, c]));

    for (const remote of remoteCategories) {
      const local = localMap.get(remote.id);
      if (!local) {
        await this.categoryRepo.saveRaw({ ...remote, syncStatus: SyncStatus.SYNCED });
      } else if (local.syncStatus === SyncStatus.DELETED) {
        continue;
      } else if (remote.updatedAt > local.updatedAt) {
        await this.categoryRepo.updateRaw({ ...remote, syncStatus: SyncStatus.SYNCED });
      }
    }
  }
}
