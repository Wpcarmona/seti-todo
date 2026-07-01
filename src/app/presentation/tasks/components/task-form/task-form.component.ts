import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
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
  @Input() categories: Category[] = [];
  @Output() taskCreated = new EventEmitter<{
    title: string;
    categoryId: string | null;
  }>();
  title = '';
  selectedCategoryId: string | null = null;

  submit(): void {
    if (!this.title.trim()) return;
    this.taskCreated.emit({
      title: this.title.trim(),
      categoryId: this.selectedCategoryId,
    });
    this.title = '';
    this.selectedCategoryId = null;
  }
}
