import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./presentation/auth/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'task-list',
    loadComponent: () =>
      import('./presentation/tasks/pages/task-list/task-list.page').then(m => m.TaskListPage),
    canActivate: [authGuard],
  },
  {
    path: 'category-list',
    loadComponent: () =>
      import('./presentation/categories/pages/category-list/category-list.page').then(m => m.CategoryListPage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
];
