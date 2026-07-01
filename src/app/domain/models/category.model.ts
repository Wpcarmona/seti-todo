import { SyncStatus } from './sync-status.enum';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
}

