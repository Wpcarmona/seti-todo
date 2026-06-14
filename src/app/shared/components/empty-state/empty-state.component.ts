import { Component, input } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [IonIcon, IonText],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  message = input('No hay elementos');

  constructor() {
    addIcons({ checkmarkCircleOutline });
  }
}
