import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import {
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { firebaseConfig } from './environments/environment';
import { RemoteConfig } from './app/infrastructure/services/remote-config';
import { TASK_REPOSITORY } from './app/domain/interfaces/task-repository.token';
import { CATEGORY_REPOSITORY } from './app/domain/interfaces/category-repository.token';
import { TaskRepository } from './app/infrastructure/repositories/task-repository';
import { CategoryRepository } from './app/infrastructure/repositories/category-repository';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAppInitializer(() => {
      const rc = inject(RemoteConfig);
      return rc.initialize();
    }),
    { provide: TASK_REPOSITORY, useClass: TaskRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
  ],
});
