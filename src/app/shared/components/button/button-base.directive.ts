import type { OnInit } from '@angular/core';
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Optional,
  SkipSelf,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AbstractControl } from '@angular/forms';
import { FormGroupDirective } from '@angular/forms';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  interval,
  merge,
  throwError,
} from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export const palettes = [
  'success',
  'danger',
  'warn',
  'default',
  'primary',
  'running',
] as const;

export type PalettesType = (typeof palettes)[number];

export type ButtonType = 'button' | 'reset' | 'submit';

export const buttonThemes = [...palettes] as const;
export type ButtonColor = (typeof buttonThemes)[number];

@Directive({})
export abstract class ButtonBaseDirective implements OnInit {
  protected formRoot?: AbstractControl;
  protected disabledInternal = false;
  protected _disabled = false;
  protected clickHandler$ = new Subject<void>();

  @HostBinding('class.app-button--disabled')
  @Input({
    transform: booleanAttribute,
  })
  public get disabled(): boolean {
    return this._disabled || this.disabledInternal;
  }

  public set disabled(dis: boolean) {
    this._disabled = dis;
  }

  @Input() public getFormRoot = true;
  @Input() public connectedTo?: ButtonBaseDirective[];
  @Input() public synchronousSubmit = false;
  @Input() public type: ButtonType = 'button';
  @Input() public onClick?: () => Observable<unknown> | void;
  @Input({
    transform: numberAttribute,
  })
  public debounceTimeMs = 500;

  public constructor(
    protected changeDetector: ChangeDetectorRef,
    protected destroy$: DestroyRef,
    protected element: ElementRef,
    @SkipSelf() @Optional() protected container: FormGroupDirective,
  ) {}

  @HostListener('click', ['$event'])
  public click(event?: PointerEvent): void {
    if (this.disabled) {
      return;
    }

    if (this.onClick && event) {
      event.preventDefault();
    }

    setTimeout(() => {
      let obs = undefined;

      if (this.onClick) {
        obs = this.onClick();
      }

      if (obs instanceof Observable) {
        this.disable();
        obs
          .pipe(
            takeUntilDestroyed(this.destroy$),
            catchError((err: Error) => {
              this.available();
              return throwError(() => err);
            }),
          )
          .subscribe(() => {
            this.available();
          });
      } else if (this.debounceTimeMs !== 0) {
        this.clickHandler$.next(undefined);
        this.disable();
      }
      this.changeDetector.markForCheck();
    }, 0);
  }

  protected disable(): void {
    if (this.formRoot && this.type === 'submit') {
      if (!this.synchronousSubmit) {
        this.formRoot.disable();
      }
    } else {
      if (this.connectedTo?.length) {
        this.connectedTo.forEach((btn) => {
          btn.toggleDisabled(true);
        });
      }
      this.disabledInternal = true;
    }
  }

  public ngOnInit(): void {
    const native = this.element.nativeElement as HTMLElement;
    native.classList.add(native.tagName.toLowerCase());
    if (this.getFormRoot && this.container?.control?.root) {
      this.formRoot = this.container.control.root;
      this.listenToFormStatus();
    }

    const dueTime = this.type !== 'submit' ? this.debounceTimeMs : 5000;
    this.clickHandler$
      .pipe(takeUntilDestroyed(this.destroy$), debounceTime(dueTime))
      .subscribe(() => {
        this.available();
      });
  }

  protected available(): void {
    if (this.type === 'submit' && this.formRoot?.status) {
      this.formRoot.enable();
    } else {
      if (this.connectedTo?.length) {
        this.connectedTo.forEach((btn) => {
          btn.toggleDisabled(false);
        });
      }
      this.disabledInternal = false;
    }
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  protected listenToFormStatus(): void {
    if (this.type !== 'submit') {
      return;
    }
    merge(interval(1000), this.formRoot!.statusChanges)
      .pipe(
        startWith(this.formRoot!.status),
        takeUntilDestroyed(this.destroy$),
        map(() => {
          return (
            this.formRoot!.pending ||
            this.formRoot!.invalid ||
            this.formRoot!.disabled
          );
        }),
        distinctUntilChanged(),
      )
      .subscribe((disabled) => {
        this.disabledInternal = disabled;
        this.changeDetector.markForCheck();
      });
  }

  protected toggleDisabled(value: boolean): void {
    this.disabledInternal = value;
    setTimeout(() => {
      this.changeDetector.markForCheck();
    });
  }
}
