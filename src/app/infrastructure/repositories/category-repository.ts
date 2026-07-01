import { inject, Injectable } from '@angular/core';
import { ICategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { Category } from '../../domain/models/category.model';
import { SyncStatus } from '../../domain/models/sync-status.enum';
import { StorageService } from '../services/storage';
import { FirestoreDatasource } from '../datasources/firestore.datasource';
import { ConnectivityService } from '../services/connectivity.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  private storage = inject(StorageService);
  private firestoreDs = inject(FirestoreDatasource);
  private connectivity = inject(ConnectivityService);
  private readonly KEY = 'categories';

  async getAll(userId: string): Promise<Category[]> {
    const all = (await this.storage.get<Category[]>(this.KEY)) ?? [];
    return all.filter(c => c.userId === userId && c.syncStatus !== SyncStatus.DELETED);
  }

  async getAllRaw(): Promise<Category[]> {
    return (await this.storage.get<Category[]>(this.KEY)) ?? [];
  }

  async save(category: Category): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, [...all, category]);

    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.saveCategory(category);
        await this.updateSyncStatus(category.id, SyncStatus.SYNCED);
      } catch {}
    }
  }

  async update(category: Category): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(c => c.id === category.id ? category : c));

    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.saveCategory(category);
        await this.updateSyncStatus(category.id, SyncStatus.SYNCED);
      } catch {}
    }
  }

  async delete(id: string): Promise<void> {
    if (this.connectivity.isOnline()) {
      try {
        await this.firestoreDs.deleteCategory(id);
        await this.hardDelete(id);
        return;
      } catch {}
    }
    await this.updateSyncStatus(id, SyncStatus.DELETED);
  }

  async getPending(userId: string): Promise<Category[]> {
    const all = await this.getAllRaw();
    return all.filter(c => c.userId === userId && c.syncStatus === SyncStatus.PENDING);
  }

  async getPendingDeletions(userId: string): Promise<Category[]> {
    const all = await this.getAllRaw();
    return all.filter(c => c.userId === userId && c.syncStatus === SyncStatus.DELETED);
  }

  async updateSyncStatus(id: string, status: SyncStatus): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(c => c.id === id ? { ...c, syncStatus: status } : c));
  }

  async hardDelete(id: string): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.filter(c => c.id !== id));
  }

  async saveRaw(category: Category): Promise<void> {
    const all = await this.getAllRaw();
    if (all.find(c => c.id === category.id)) return;
    await this.storage.set(this.KEY, [...all, category]);
  }

  async updateRaw(category: Category): Promise<void> {
    const all = await this.getAllRaw();
    await this.storage.set(this.KEY, all.map(c => c.id === category.id ? category : c));
  }
}
