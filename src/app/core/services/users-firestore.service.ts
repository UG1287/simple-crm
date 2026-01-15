import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Customer } from '../../features/customers/customer.model';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersFirestoreService {
  private readonly firestore = inject(Firestore);

  addUser(user: Customer) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      street: user.street,
      zipCode: user.zipCode,
      city: user.city,
      createdAt: new Date(),
    });
  }

  getUsers$(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' });
  }

  // ✅ live doc (throws if doc missing)
  getUserById$(id: string): Observable<any> {
    const ref = doc(this.firestore, `users/${id}`);
    return docData(ref, { idField: 'id' });
  }

  // ✅ BONUS: safe live doc (returns null if missing)
  getUserByIdSafe$(id: string): Observable<any | null> {
    if (!id) return of(null);
    return this.getUserById$(id).pipe(catchError(() => of(null)));
  }

  // ✅ edit
  updateUser(id: string, patch: Partial<Customer>) {
    const ref = doc(this.firestore, `users/${id}`);
    return updateDoc(ref, {
      ...patch,
      updatedAt: new Date(),
    } as any);
  }

  // ✅ delete
  deleteUser(id: string) {
    const ref = doc(this.firestore, `users/${id}`);
    return deleteDoc(ref);
  }
}
