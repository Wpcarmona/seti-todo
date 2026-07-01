import { User } from '../models/user.model';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, displayName: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}
