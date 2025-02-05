import { Routes } from '@angular/router';
import { ConnexionComponent } from './views/connexion/connexion.component';
import { InscriptionComponent } from './views/inscription/inscription.component';
export const routes: Routes = [
    {
        path: 'inscription',
        component: InscriptionComponent,
        pathMatch: 'full',
    },
    {
        path : 'connexion',
        component : ConnexionComponent,
        pathMatch: 'full',
    },
    {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full',
}];

