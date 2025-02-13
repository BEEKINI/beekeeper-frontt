import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TokenService } from '../../services/token.service';

export interface AsideNavItem {
  icon: string;
  label: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    ButtonComponent,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgFor,
    NgClass,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './aside-nav.component.scss'],
})
export class DashboardComponent {
  protected readonly items: AsideNavItem[] = [
    {
      icon: 'map',
      label: 'Carte',
      link: '/dashboard/map',
    },
    {
      label: 'Liste des ruchers',
      icon: 'inventory_2',
      link: '/dashboard/apiaries',
    },
    {
      label: 'Paramétrage essaims',
      icon: 'settings',
      link: '/dashboard/swarms-param',
    },
    {
      label: 'Mon compte',
      icon: 'account_circle',
      link: '/dashboard/account',
    },
  ];

  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly tokenService = inject(TokenService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);

  protected isMobile: boolean = false;

  public constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  protected sidenavOpened: boolean = false;

  protected navigateTo(link: string): void {
    this.router.navigateByUrl(link);
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }

  protected isActive(link: string): boolean {
    return this.router.url === link;
  }

  protected logout(): void {
    this.tokenService.setToken(null);
    this.router.navigateByUrl('/connexion');
  }

  protected toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
