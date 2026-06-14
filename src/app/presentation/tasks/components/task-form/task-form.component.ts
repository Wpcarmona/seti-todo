import { Component, input, output, signal } from '@angular/core';
import {
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { Category } from '../../../../domain/models/category.model';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [IonItem, IonInput, IonSelect, IonSelectOption, IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  categories = input<Category[]>([]);
  taskCreated = output<{ title: string; categoryId: string | null }>();

  title = signal('');
  selectedCategoryId = signal<string | null>(null);

  submit() {
    if (!this.title().trim()) return;
    this.taskCreated.emit({
      title: this.title().trim(),
      categoryId: this.selectedCategoryId(),
    });
    this.title.set('');
    this.selectedCategoryId.set(null);
  }
}
