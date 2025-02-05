import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectTrigger,
} from '@angular/material/select';
import { startWith } from 'rxjs';

import { FormBase, NOOP_ACCESSOR_PROVIDER } from '../../form.base';
import { bind } from '../../decorators/bind.decorator';
import { LabelComponent } from '../label/label.component';
import { FormService } from '../../services/form.service';

export interface SelectOptionModel<T> {
  label: string;
  value: T;
}

@Component({
  standalone: true,
  imports: [
    MatError,
    MatFormField,
    MatHint,
    MatOption,
    MatSelect,
    MatSelectTrigger,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    ReactiveFormsModule,
    LabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NOOP_ACCESSOR_PROVIDER],
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['../../form.base.scss', './select.component.scss'],
})
export class SelectComponent<T>
  extends FormBase<T | T[] | null>
  implements AfterViewInit, OnChanges
{
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() public optionTemplate?: TemplateRef<T>;

  @Input({ required: true }) public options!: SelectOptionModel<T>[];

  @Input() public triggerTemplate?: TemplateRef<T>;
  @Input() public panelWidth: 'matchOption' | 'matchTrigger' = 'matchTrigger';

  @Input()
  public trackBy(index: number, value: T): unknown {
    return this.trackByBase(index, value);
  }

  @Input()
  public compareWith(a: T, b: T): boolean {
    return this.compareWithBase(a, b);
  }

  @Input() public placeholder = '';
  @Input() public hint?: string;
  @Input() public multiple = false;

  public trigger?: SelectOptionModel<T>;

  public constructor(
    destroyRef: DestroyRef,
    formService: FormService,
    injector: Injector,
  ) {
    super(destroyRef, formService, injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].isFirstChange()) {
      if (this.multiple) {
        this.control.setValue(
          this.options
            .filter((option) =>
              (this.control.value as T[]).some((v) =>
                this.compareWithFn(v, option.value),
              ),
            )
            .map((option) => option.value),
        );
      } else {
        this.control.setValue(
          this.options.find((el) =>
            this.compareWithFn(this.control.value as T, el.value),
          )?.value ?? null,
        );
      }
    }
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.controlChanges();
  }

  protected controlChanges(): void {
    this.control.valueChanges
      .pipe(startWith(this.control.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.trigger = this.options.find((el) =>
          this.compareWithFn(value as T, el.value),
        );
      });
  }

  @bind
  protected trackByFn(index: number, option: SelectOptionModel<T>): unknown {
    if (typeof this.trackBy === 'function') {
      return this.trackBy(index, option.value);
    }
    return option.value;
  }

  @bind
  protected compareWithFn(a: T | null, b: T | null): boolean {
    if (typeof this.compareWith === 'function' && a && b) {
      return this.compareWith(a, b);
    }
    return a === b;
  }
}
