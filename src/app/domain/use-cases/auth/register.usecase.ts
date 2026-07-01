import { inject, Injectable } from '@angular/core';
import { AUTH_REPOSITORY } from '../../interfaces/auth-repository.token';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  private repo = inject(AUTH_REPOSITORY);

  execute(email: string, password: string, displayName: string): Promise<User> {
    return this.repo.register(email, password, displayName);
  }
}
