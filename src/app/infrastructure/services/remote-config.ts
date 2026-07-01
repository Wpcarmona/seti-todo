import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  RemoteConfig as FbRemoteConfig,
  fetchAndActivate,
  getValue,
} from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class RemoteConfig {
  private rc = inject(FbRemoteConfig);

  private showCategoriesSubject = new BehaviorSubject<boolean>(true);
  readonly showCategories$ = this.showCategoriesSubject.asObservable();

  async initialize(): Promise<void> {
    this.rc.defaultConfig = { show_categories: true };
    this.rc.settings.minimumFetchIntervalMillis = 0;
    this.rc.settings.fetchTimeoutMillis = 60000;

    try {
      await fetchAndActivate(this.rc);
      const value = getValue(this.rc, 'show_categories').asBoolean();
      this.showCategoriesSubject.next(value);
    } catch (e) {
      this.showCategoriesSubject.next(true);
    }
  }
}
