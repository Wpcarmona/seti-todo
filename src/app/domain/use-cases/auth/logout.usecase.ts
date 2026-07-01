import { inject, Injectable } from '@angular/core';
import { AUTH_REPOSITORY } from '../../interfaces/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private repo = inject(AUTH_REPOSITORY);

  execute(): Promise<void> {
    return this.repo.logout();
  }
}
