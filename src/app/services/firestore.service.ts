import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Obra {
  id?: string;
  titulo: string;
  autor: string;
  fecha: string;
  categoria: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private galeriaCollection = collection(this.firestore, 'galeria');

  // Sistema de Login
  user$ = user(this.auth); // Observable para saber si hay usuario conectado

  // --- READ (Leer) ---
  private _obras$ = collectionData(this.galeriaCollection, { idField: 'id' }) as Observable<Obra[]>;
  
  getObras() { return this._obras$; }

  // --- POST (Crear) ---
  agregarObra(obra: Obra) {
    return addDoc(this.galeriaCollection, obra);
  }

  // --- PUT (Editar) ---
  actualizarObra(id: string, obra: Partial<Obra>) {
    const docRef = doc(this.firestore, 'galeria', id);
    return updateDoc(docRef, obra);
  }

  // --- DELETE (Borrar) ---
  borrarObra(id: string) {
    const docRef = doc(this.firestore, 'galeria', id);
    return deleteDoc(docRef);
  }

  // --- AUTH (Google) ---
  login() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }
}