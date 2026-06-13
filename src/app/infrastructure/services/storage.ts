import { inject, Injectable } from '@angular/core';
  import { Storage } from '@ionic/storage-angular';

  @Injectable({ providedIn: 'root' })
  export class StorageService { 
    private storage = inject(Storage);
    private ready = false;

    private async init(): Promise<void> {
      if (!this.ready) { 
        await this.storage.create();
        this.ready = true;
      }
    }
  
    async get<T>(key: string): Promise<T | null> {
      await this.init(); 
      return this.storage.get(key);
    }

    async set<T>(key: string, value: T): Promise<void> {
      await this.init();
      await this.storage.set(key, value);
    }
  
    async remove(key: string): Promise<void> {
      await this.init();
      await this.storage.remove(key);
    }
  }