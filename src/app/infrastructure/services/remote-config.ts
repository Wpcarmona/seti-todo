import { inject, Injectable, signal } from '@angular/core';
import {
  RemoteConfig as FbRemoteConfig,
  fetchAndActivate,
  getValue,
} from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class RemoteConfig {
  private rc = inject(FbRemoteConfig);

  showCategories = signal(true);

  async initialize(): Promise<void> {
    this.rc.defaultConfig = { show_categories: true };
    this.rc.settings.minimumFetchIntervalMillis = 0;
    this.rc.settings.fetchTimeoutMillis = 60000;

    try {
      await fetchAndActivate(this.rc);
      const value = getValue(this.rc, 'show_categories').asBoolean();
      this.showCategories.set(value);
    } catch (e) {
      this.showCategories.set(true);
    }
  }
}
