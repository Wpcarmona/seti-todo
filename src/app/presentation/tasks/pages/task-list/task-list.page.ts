import { Component, OnInit, signal, computed, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
  IonButtons,
  IonButton,
  IonModal,
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
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonChip,
    IonButtons,
    IonButton,
    IonModal,
    RouterLink,
    TaskItemComponent,
    TaskFormComponent,
    EmptyStateComponent,
  ],
})
export class TaskListPage implements OnInit {
  private getTasks = inject(GetTasksUseCase);
  private createTask = inject(CreateTaskUseCase);
  private updateTask = inject(UpdateTaskUseCase);
  private deleteTask = inject(DeleteTaskUseCase);
  private getCategories = inject(GetCategoriesUseCase);
  remoteConfig = inject(RemoteConfig);

  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | null>(null);
  isModalOpen = signal(false);

  filteredTasks = computed(() => {
    const id = this.selectedCategoryId();
    return id ? this.tasks().filter((t) => t.categoryId === id) : this.tasks();
  });

  pendingCount = computed(
    () => this.tasks().filter((t) => !t.completed).length,
  );

  categoryMap = computed(() => {
    const map = new Map<string, Category>();
    this.categories().forEach((c) => map.set(c.id, c));
    return map;
  });

  constructor() {
    addIcons({ add, pricetag });
  }

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load() {
    const [tasks, categories] = await Promise.all([
      this.getTasks.execute(),
      this.getCategories.execute(),
    ]);
    this.tasks.set(tasks);
    this.categories.set(categories);
  }

  getCategoryForTask(task: Task): Category | null {
    return task.categoryId
      ? (this.categoryMap().get(task.categoryId) ?? null)
      : null;
  }

  selectCategory(id: string | null) {
    this.selectedCategoryId.set(id);
  }

  async onTaskCreated(data: { title: string; categoryId: string | null }) {
    const task = await this.createTask.execute(data.title, data.categoryId);
    this.tasks.update((tasks) => [...tasks, task]);
    this.isModalOpen.set(false);
  }

  async onToggleTask(task: Task) {
    await this.updateTask.execute(task);
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? task : t)),
    );
  }

  async onDeleteTask(id: string) {
    await this.deleteTask.execute(id);
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }
}
