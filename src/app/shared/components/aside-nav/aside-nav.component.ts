import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { UserService } from '../../../services/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface AsideNavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-aside-nav',
  standalone: true,
  imports: [
    ButtonComponent,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgFor,
    NgClass,
    NgIf,
  ],
  templateUrl: './aside-nav.component.html',
  styleUrl: './aside-nav.component.scss',
})
export class AsideNavComponent {
  public items = input.required<AsideNavItem[]>();
  public isMobile: boolean = false;
  public sidenavOpened: boolean = false;

  protected readonly userService = inject(UserService);
  protected readonly router = inject(Router);
  protected readonly breakpointObserver = inject(BreakpointObserver);

  public constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

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
    this.userService.setCurrentUser(null);
    this.router.navigateByUrl('/connexion');
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
