import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';
import { Category } from '../../../../domain/models/category.model';
import { ChangeDetectionStrategy } from '@angular/core';

export interface CategoryFormData {
  name: string;
  color: string;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: true,
  imports: [IonItem, IonInput, IonButton, IonList, IonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnInit {
  @Input() editingCategory: Category | null = null;
  @Output() formSubmitted = new EventEmitter<CategoryFormData>();

  name = '';
  color = '#3880ff';

  readonly colors = [
    '#3880ff',
    '#2dd36f',
    '#eb445a',
    '#ffc409',
    '#92949c',
    '#6a64ff',
    '#f4a261',
    '#2ec4b6',
  ];

  ngOnInit(): void {
    if (this.editingCategory) {
      this.name = this.editingCategory.name;
      this.color = this.editingCategory.color;
    }
  }

  submit(): void {
    if (!this.name.trim()) return;
    this.formSubmitted.emit({ name: this.name.trim(), color: this.color });
    this.name = '';
    this.color = '#3880ff';
  }
}
