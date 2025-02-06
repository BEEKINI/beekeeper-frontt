import { Component } from '@angular/core';
import {
  AsideNavComponent,
  AsideNavItem,
} from '../../shared/components/aside-nav/aside-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsideNavComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly items: AsideNavItem[] = [
    {
      icon: 'map',
      label: 'Carte',
      link: '/map',
    },
    {
      label: 'Liste des ruchers',
      icon: 'inventory_2',
      link: '/apiaries',
    },
    {
      label: 'Paramétrage essaims',
      icon: 'settings',
      link: '/swarms-param',
    },
    {
      label: 'Mon compte',
      icon: 'account_circle',
      link: '/account',
    },
  ];
}
