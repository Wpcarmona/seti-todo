import { Component, input } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [IonIcon, IonText],
})
export class EmptyStateComponent {
  message = input('No hay elementos');

  constructor() {
    addIcons({ checkmarkCircleOutline });
  }
}
