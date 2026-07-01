import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAdd, checkmarkCircle } from 'ionicons/icons';
import { RegisterUseCase } from '../../../domain/use-cases/auth/register.usecase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    RouterLink,
  ],
})
export class RegisterPage {
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);

  displayName = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor() {
    addIcons({ personAdd, checkmarkCircle });
  }

  async register(): Promise<void> {
    if (!this.displayName.trim() || !this.email.trim() || !this.password.trim()) {
      this.error = 'Por favor completa todos los campos';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.registerUseCase.execute(this.email.trim(), this.password, this.displayName.trim());
      await this.router.navigate(['/task-list'], { replaceUrl: true });
    } catch (err: any) {
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return 'Error al registrarse. Intenta de nuevo';
    }
  }
}
