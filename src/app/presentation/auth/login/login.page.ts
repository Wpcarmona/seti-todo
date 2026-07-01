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
import { checkmarkCircle, lockClosed, mail } from 'ionicons/icons';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  private loginUseCase = inject(LoginUseCase);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  constructor() {
    addIcons({ checkmarkCircle, lockClosed, mail });
  }

  async login(): Promise<void> {
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Por favor completa todos los campos';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.loginUseCase.execute(this.email.trim(), this.password);
      await this.router.navigate(['/task-list'], { replaceUrl: true });
    } catch (err: any) {
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return 'Error al iniciar sesión. Intenta de nuevo';
    }
  }
}
