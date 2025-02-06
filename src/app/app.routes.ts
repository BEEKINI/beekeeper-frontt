import { Routes } from '@angular/router';
import { ConnexionComponent } from './views/connexion/connexion.component';
import { InscriptionComponent } from './views/inscription/inscription.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
export const routes: Routes = [
  {
    path: 'inscription',
    component: InscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: 'connexion',
    component: ConnexionComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
    children: [
      // todo add children when dev each tabs
    ],
  },
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full',
  },
];
