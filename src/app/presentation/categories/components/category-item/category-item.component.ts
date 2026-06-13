import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, pencil } from 'ionicons/icons';
import { Category } from '../../../../domain/models/category.model';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class CategoryItemComponent {
  category = input.required<Category>();
  edited = output<Category>();
  deleted = output<string>();

  constructor() {
    addIcons({ trash, pencil });
  }
}
