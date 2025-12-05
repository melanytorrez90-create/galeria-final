import 'zone.js'; // Importante para que Angular funcione
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// CORRECCIÓN: Importamos AppComponent desde el archivo correcto
import { AppComponent } from './app/app.component'; 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));