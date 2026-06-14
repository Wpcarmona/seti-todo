import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'task-list',
    loadComponent: () =>
      import('./presentation/tasks/pages/task-list/task-list.page').then(
        (m) => m.TaskListPage,
      ),
  },
  {
    path: 'category-list',
    loadComponent: () =>
      import('./presentation/categories/pages/category-list/category-list.page').then(
        (m) => m.CategoryListPage,
      ),
  },
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
];
