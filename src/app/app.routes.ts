import { Routes } from '@angular/router';
import { ConnexionComponent } from './views/connexion/connexion.component';
import { InscriptionComponent } from './views/inscription/inscription.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';
import { MapComponent } from './views/map/map.component';
import { ApiariesComponent } from './views/apiaries/apiaries.component';
import { SwarmsParamComponent } from './views/swarms-param/swarms-param.component';
import { AccountComponent } from './views/account/account.component';
import { ApiaryComponent } from './views/apiary/apiary.component';
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
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
      {
        path: 'map',
        component: MapComponent,
      },
      {
        path: 'apiaries',
        component: ApiariesComponent,
      },
      {
        path: 'apiaries/:id',
        component: ApiaryComponent,
      },
      {
        path: 'swarms-param',
        component: SwarmsParamComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full',
  },
];
