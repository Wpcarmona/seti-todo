import { Component, input, output, signal, OnInit } from '@angular/core';
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
  editingCategory = input<Category | null>(null);
  formSubmitted = output<CategoryFormData>();

  name = signal('');
  color = signal('#3880ff');

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

  ngOnInit() {
    const cat = this.editingCategory();
    if (cat) {
      this.name.set(cat.name);
      this.color.set(cat.color);
    }
  }

  submit() {
    if (!this.name().trim()) return;
    this.formSubmitted.emit({ name: this.name().trim(), color: this.color() });
    this.name.set('');
    this.color.set('#3880ff');
  }
}
