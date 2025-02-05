import { Routes } from '@angular/router';
import { InscriptionComponent } from './views/inscription/inscription.component';
export const routes: Routes = [
  {
    path: 'inscription',
    component: InscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'inscription',
    pathMatch: 'full',
  },
];
