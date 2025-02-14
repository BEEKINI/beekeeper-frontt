import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apiaries',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './apiaries.component.html',
  styleUrl: './apiaries.component.scss',
})
export class ApiariesComponent implements OnInit {
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);

  protected apiaries: ApiariesModel[] = [];

  public ngOnInit(): void {
    this.apiariesQueries
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((apiaries) => {
        this.apiaries = apiaries;
      });
  }

  protected goToApiaryView(id: number): void {
    this.router.navigateByUrl(`/dashboard/apiaries/${id}`);
  }
}
