import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { ConnectivityService } from './infrastructure/services/connectivity.service';
import { SyncService } from './infrastructure/services/sync.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private auth = inject(Auth);
  private connectivity = inject(ConnectivityService);
  private syncService = inject(SyncService);
  private toastController = inject(ToastController);

  private previousOnline: boolean | null = null;

  constructor() {
    this.connectivity.isOnline$.subscribe(isOnline => {
      if (this.previousOnline === null) {
        this.previousOnline = isOnline;
        return;
      }
      if (isOnline !== this.previousOnline) {
        this.previousOnline = isOnline;
        if (isOnline) {
          this.showToast('Conexión restaurada', 'success');
          this.triggerSync();
        } else {
          this.showToast('Sin conexión a internet', 'warning');
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (navigator.onLine) {
      this.triggerSync();
    }
  }

  private async triggerSync(): Promise<void> {
    await this.auth.authStateReady();
    const userId = this.auth.currentUser?.uid;
    if (userId) {
      await this.syncService.syncAll(userId);
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
