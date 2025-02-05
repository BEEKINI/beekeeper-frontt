import type { AfterViewInit } from '@angular/core';
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Injector,
  Input,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { ControlValueAccessor, FormControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import type { MatFormFieldAppearance } from '@angular/material/form-field';
import {
  MatFormFieldControl,
  SubscriptSizing,
} from '@angular/material/form-field';
import type { Observable } from 'rxjs';
import { BehaviorSubject, combineLatest, map, merge, of, tap } from 'rxjs';
import { FormService } from './services/form.service';

@Directive()
export abstract class FormBase<T> implements AfterViewInit {
  @ViewChild(MatFormFieldControl) protected formFieldControl:
    | MatFormFieldControl<T>
    | undefined;

  protected changeDetectorRef: ChangeDetectorRef;

  @Input() public set errorMessages(
    newValue: Record<string, string> | undefined,
  ) {
    this.errorMessageSubject.next(newValue ?? {});
  }

  @Input() public subscriptSizing: SubscriptSizing = 'fixed';
  protected errorMessageSubject = new BehaviorSubject<Record<string, string>>(
    {},
  );

  protected readonly formFieldAppearance: MatFormFieldAppearance = 'outline';

  protected errorMessage = '';

  protected errorStateMatcher: ErrorStateMatcher;

  protected readonly ngControl: NgControl;

  public constructor(
    protected destroyRef: DestroyRef,
    protected awFormService: FormService,
    injector: Injector,
  ) {
    this.ngControl = injector.get(NgControl, undefined, {
      self: true,
    });
    this.errorStateMatcher = injector.get(ErrorStateMatcher);
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
  }

  public ngAfterViewInit(): void {
    this.mapErrorMessage(
      this.statusChange,
      this.control,
      this.errorMessageSubject.asObservable(),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((errorMessage) => {
        this.errorMessage = errorMessage;
      });
  }

  public mapErrorMessage(
    statusChange: Observable<unknown>,
    control: FormControl<unknown>,
    errorMessages: Observable<Record<string, string>>,
  ): Observable<string> {
    if (!statusChange) {
      return of('');
    }

    return combineLatest([statusChange, errorMessages]).pipe(
      map(([, errorMessage]) => {
        if (this.errorStateMatcher.isErrorState(control, null)) {
          return this.awFormService.getErrors(control, errorMessage);
        }
        return '';
      }),
    );
  }

  protected get statusChange(): Observable<unknown> {
    const controlStatusChanges = this.control.statusChanges.pipe(
      tap(() => {
        this.changeDetectorRef.markForCheck();
      }),
    );
    return this.formFieldControl
      ? merge(this.formFieldControl.stateChanges, controlStatusChanges)
      : controlStatusChanges;
  }

  protected get control(): FormControl<T> {
    return this.ngControl.control as FormControl<T>;
  }

  protected get id(): string {
    return this.formFieldControl ? this.formFieldControl.id : '';
  }

  protected get required(): boolean {
    return this.control.hasValidator(Validators.required);
  }

  protected get disabled(): boolean {
    return this.control.disabled;
  }

  protected compareWithBase(a: T, b: T): boolean {
    return typeof a !== 'object' && typeof b !== 'object'
      ? a === b
      : (a as { id: number })?.id === (b as { id: number })?.id;
  }

  protected trackByBase(index: number, value: T): unknown {
    return typeof value !== 'object' ? value : (value as { id: number })?.id;
  }
}

export const NOOP_VALUE_ACCESSOR: ControlValueAccessor = {
  writeValue(): void {
    // noop
  },
  registerOnChange(): void {
    // noop
  },
  registerOnTouched(): void {
    // noop
  },
};

export const NOOP_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useValue: NOOP_VALUE_ACCESSOR,
  multi: true,
};
