import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { Task } from '../../../../domain/models/task.model';
import { Category } from '../../../../domain/models/category.model';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  task = input.required<Task>();
  category = input<Category | null>(null);
  toggled = output<Task>();
  deleted = output<string>();

  constructor() {
    addIcons({ trash });
  }

  toggle() {
    this.toggled.emit({ ...this.task(), completed: !this.task().completed });
  }

  delete() {
    this.deleted.emit(this.task().id);
  }
}
