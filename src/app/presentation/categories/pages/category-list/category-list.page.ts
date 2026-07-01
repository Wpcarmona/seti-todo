import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonModal,
  IonBackButton,
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';

import { GetCategoriesUseCase } from '../../../../domain/use-cases/category/get-categories.usecase';
import { CreateCategoryUseCase } from '../../../../domain/use-cases/category/create-category.usecase';
import { UpdateCategoryUseCase } from '../../../../domain/use-cases/category/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../../domain/use-cases/category/delete-category.usecase';
import { Category } from '../../../../domain/models/category.model';
import { CategoryItemComponent } from '../../components/category-item/category-item.component';
import {
  CategoryFormComponent,
  CategoryFormData,
} from '../../components/category-form/category-form.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
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
    IonButtons,
    IonButton,
    IonModal,
    IonBackButton,
    CategoryItemComponent,
    CategoryFormComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class CategoryListPage implements OnInit {
  private getCategories = inject(GetCategoriesUseCase);
  private createCategory = inject(CreateCategoryUseCase);
  private updateCategory = inject(UpdateCategoryUseCase);
  private deleteCategory = inject(DeleteCategoryUseCase);

  categories$ = new BehaviorSubject<Category[]>([]);
  isModalOpen$ = new BehaviorSubject<boolean>(false);
  editingCategory$ = new BehaviorSubject<Category | null>(null);

  constructor() {}

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load(): Promise<void> {
    this.categories$.next(await this.getCategories.execute());
  }

  openCreate(): void {
    this.editingCategory$.next(null);
    this.isModalOpen$.next(true);
  }
  openEdit(cat: Category): void {
    this.editingCategory$.next(cat);
    this.isModalOpen$.next(true);
  }

  closeModal(): void {
    this.isModalOpen$.next(false);
    this.editingCategory$.next(null);
  }

  async onFormSubmitted(data: CategoryFormData): Promise<void> {
    const editing = this.editingCategory$.getValue();
    if (editing) {
      const updated = { ...editing, ...data };
      await this.updateCategory.execute(updated);
      this.categories$.next(
        this.categories$
          .getValue()
          .map((c) => (c.id === updated.id ? updated : c)),
      );
    } else {
      const created = await this.createCategory.execute(data.name, data.color);
      this.categories$.next([...this.categories$.getValue(), created]);
    }
    this.closeModal();
  }

  async onDeleteCategory(id: string): Promise<void> {
    await this.deleteCategory.execute(id);
    this.categories$.next(
      this.categories$.getValue().filter((c) => c.id !== id),
    );
  }
}
