import { inject, Injectable } from '@angular/core';
import { AUTH_REPOSITORY } from '../../interfaces/auth-repository.token';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private repo = inject(AUTH_REPOSITORY);

  execute(email: string, password: string): Promise<User> {
    return this.repo.login(email, password);
  }
}
