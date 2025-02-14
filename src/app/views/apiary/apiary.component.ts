import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ApiariesModel, ApiariesQueries } from '../../queries/apiaries.queries';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ActionModalService } from '../../modals/action-modal/action-modal.service';
import { EditApiaryModalService } from '../../modals/edit-apiary-modal/edit-apiray-modal.service';

@Component({
  selector: 'app-apiary',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, ButtonComponent],
  templateUrl: './apiary.component.html',
  styleUrl: './apiary.component.scss',
})
export class ApiaryComponent implements OnInit {
  protected readonly apiariesQueries = inject(ApiariesQueries);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly actionModal = inject(ActionModalService);
  protected readonly editApiaryModal = inject(EditApiaryModalService);
  protected readonly router = inject(Router);

  protected apiary!: ApiariesModel;

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const apiaryId = +params.get('id')!;

        this.apiariesQueries
          .read(apiaryId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((apiary) => {
            this.apiary = apiary;
          });
      });
  }

  protected editApiary(): void {
    this.editApiaryModal.open({
      name: this.apiary.name,
      hives: this.apiary.hives ?? [],
    });
  }

  protected deleteApiary(): void {
    this.actionModal.open({
      elementLabel: this.apiary.name,
      callback: () => {
        this.apiariesQueries
          .delete(this.apiary.id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/dashboard/apiaries']);
          });
      },
    });
  }
}
