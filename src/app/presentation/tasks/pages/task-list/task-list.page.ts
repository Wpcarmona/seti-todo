import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
  IonButtons,
  IonButton,
  IonModal,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pricetag } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

import { GetTasksUseCase } from '../../../../domain/use-cases/task/get-tasks.usecase';
import { CreateTaskUseCase } from '../../../../domain/use-cases/task/create-task.usecase';
import { UpdateTaskUseCase } from '../../../../domain/use-cases/task/update-task.usecase';
import { DeleteTaskUseCase } from '../../../../domain/use-cases/task/delete-task.usecase';
import { GetCategoriesUseCase } from '../../../../domain/use-cases/category/get-categories.usecase';
import { Task } from '../../../../domain/models/task.model';
import { Category } from '../../../../domain/models/category.model';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { RemoteConfig } from '../../../../infrastructure/services/remote-config';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonChip,
    IonButtons,
    IonButton,
    IonModal,
    IonRefresher,
    IonRefresherContent,
    RouterLink,
    TaskItemComponent,
    TaskFormComponent,
    EmptyStateComponent,
    ScrollingModule,
    AsyncPipe,
  ],
})
export class TaskListPage implements OnInit {
  private getTasks = inject(GetTasksUseCase);
  private createTask = inject(CreateTaskUseCase);
  private updateTask = inject(UpdateTaskUseCase);
  private deleteTask = inject(DeleteTaskUseCase);
  private getCategories = inject(GetCategoriesUseCase);
  remoteConfig = inject(RemoteConfig);

  private tasks$ = new BehaviorSubject<Task[]>([]);
  categories$ = new BehaviorSubject<Category[]>([]);
  selectedCategoryId$ = new BehaviorSubject<string | null>(null);
  isModalOpen$ = new BehaviorSubject<boolean>(false);

  filteredTasks$ = combineLatest([
    this.tasks$,
    this.categories$,
    this.selectedCategoryId$,
  ]).pipe(
    map(([tasks, categories, id]) => {
      const categoryMap = new Map(categories.map((c) => [c.id, c]));
      const filtered = id ? tasks.filter((t) => t.categoryId === id) : tasks;
      return filtered.map((t) => ({
        ...t,
        category: t.categoryId ? (categoryMap.get(t.categoryId) ?? null) : null,
      }));
    }),
  );

  pendingCount$ = this.tasks$.pipe(
    map((tasks) => tasks.filter((t) => !t.completed).length),
  );

  constructor() {
    addIcons({ add, pricetag });
  }

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load(): Promise<void> {
    const [tasks, categories] = await Promise.all([
      this.getTasks.execute(),
      this.getCategories.execute(),
    ]);
    this.tasks$.next(tasks);
    this.categories$.next(categories);
  }

  selectCategory(id: string | null): void {
    this.selectedCategoryId$.next(id);
  }

  async onTaskCreated(data: {
    title: string;
    categoryId: string | null;
  }): Promise<void> {
    const task = await this.createTask.execute(data.title, data.categoryId);
    this.tasks$.next([...this.tasks$.getValue(), task]);
    this.isModalOpen$.next(false);
  }

  async onToggleTask(task: Task): Promise<void> {
    await this.updateTask.execute(task);
    this.tasks$.next(
      this.tasks$.getValue().map((t) => (t.id === task.id ? task : t)),
    );
  }

  async onDeleteTask(id: string): Promise<void> {
    await this.deleteTask.execute(id);
    this.tasks$.next(this.tasks$.getValue().filter((t) => t.id !== id));
  }

  async onRefresh(event: CustomEvent): Promise<void> {
    await Promise.all([this.remoteConfig.initialize(), this.load()]);
    (event.target as HTMLIonRefresherElement).complete();
  }
}
