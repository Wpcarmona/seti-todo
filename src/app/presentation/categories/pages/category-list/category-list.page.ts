import { Component, OnInit, signal, inject } from '@angular/core';
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
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

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
  ],
})
export class CategoryListPage implements OnInit {
  private getCategories = inject(GetCategoriesUseCase);
  private createCategory = inject(CreateCategoryUseCase);
  private updateCategory = inject(UpdateCategoryUseCase);
  private deleteCategory = inject(DeleteCategoryUseCase);

  categories = signal<Category[]>([]);
  isModalOpen = signal(false);
  editingCategory = signal<Category | null>(null);

  constructor() {}

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load() {
    this.categories.set(await this.getCategories.execute());
  }

  openCreate() {
    this.editingCategory.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(category: Category) {
    this.editingCategory.set(category);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingCategory.set(null);
  }

  async onFormSubmitted(data: CategoryFormData) {
    const editing = this.editingCategory();
    if (editing) {
      const updated: Category = { ...editing, ...data };
      await this.updateCategory.execute(updated);
      this.categories.update((cats) =>
        cats.map((c) => (c.id === updated.id ? updated : c)),
      );
    } else {
      const created = await this.createCategory.execute(data.name, data.color);
      this.categories.update((cats) => [...cats, created]);
    }
    this.closeModal();
  }

  async onDeleteCategory(id: string) {
    await this.deleteCategory.execute(id);
    this.categories.update((cats) => cats.filter((c) => c.id !== id));
  }
}
