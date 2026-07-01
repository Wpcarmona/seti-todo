import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Task } from '../../domain/models/task.model';
import { Category } from '../../domain/models/category.model';

@Injectable({ providedIn: 'root' })
export class FirestoreDatasource {
  private firestore = inject(Firestore);

  async getTasks(userId: string): Promise<Task[]> {
    const ref = collection(this.firestore, 'tasks');
    const q = query(ref, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Task);
  }

  async saveTask(task: Task): Promise<void> {
    const ref = doc(this.firestore, 'tasks', task.id);
    await setDoc(ref, task);
  }

  async deleteTask(id: string): Promise<void> {
    const ref = doc(this.firestore, 'tasks', id);
    await deleteDoc(ref);
  }

  async getCategories(userId: string): Promise<Category[]> {
    const ref = collection(this.firestore, 'categories');
    const q = query(ref, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Category);
  }

  async saveCategory(category: Category): Promise<void> {
    const ref = doc(this.firestore, 'categories', category.id);
    await setDoc(ref, category);
  }

  async deleteCategory(id: string): Promise<void> {
    const ref = doc(this.firestore, 'categories', id);
    await deleteDoc(ref);
  }
}
