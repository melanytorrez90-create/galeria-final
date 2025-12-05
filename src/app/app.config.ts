import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth'; // <--- IMPORTANTE

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
        projectId: "apis-35db4",
        appId: "1:210077344166:web:3bc8c55e550f9dc8cd6f67",
        storageBucket: "apis-35db4.firebasestorage.app",
        apiKey: "AIzaSyCSKCJHtS2wHsPNbbjrND9uwUdZZNtfQps",
        authDomain: "apis-35db4.firebaseapp.com",
        messagingSenderId: "210077344166",
        measurementId: "G-MKHKCE3N0T"
    })),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()) // <--- ACTIVAMOS AUTH
  ]
};