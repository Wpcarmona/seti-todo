import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from '@angular/fire/auth';
import { IAuthRepository } from '../../domain/interfaces/auth-repository.interface';
import { User } from '../../domain/models/user.model';

@Injectable()
export class AuthRepository implements IAuthRepository {
  private auth = inject(Auth);

  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return {
      uid: credential.user.uid,
      email: credential.user.email ?? '',
      displayName: credential.user.displayName ?? '',
    };
  }

  async register(email: string, password: string, displayName: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName });
    return {
      uid: credential.user.uid,
      email: credential.user.email ?? '',
      displayName,
    };
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
    };
  }
}
