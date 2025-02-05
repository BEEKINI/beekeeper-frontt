import {
  NgClass,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  booleanAttribute,
} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  Injector,
  Input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatError,
  MatFormField,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { LabelComponent } from '../label/label.component';
import { FormBase, NOOP_ACCESSOR_PROVIDER } from '../../form.base';
import { FormService } from '../../services/form.service';
import { ButtonColor } from '../button/button-base.directive';

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'select'
  | 'submit'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'time'
  | 'url'
  | 'week';

export type HintColor = Omit<ButtonColor, 'default' | 'primary'>;

@Component({
  standalone: true,
  imports: [
    LabelComponent,
    MatAutocompleteTrigger,
    MatCheckbox,
    MatError,
    MatFormField,
    MatInput,
    NgClass,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
    ReactiveFormsModule,
    MatSuffix,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NOOP_ACCESSOR_PROVIDER],
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['../../form.base.scss', './input.component.scss'],
})
export class InputComponent<T>
  extends FormBase<T>
  implements OnChanges, AfterViewInit
{
  protected hintClass = '';
  protected _type = 'text';

  @HostBinding('class.app-input') protected mainClass = true;
  @HostBinding('class.app-input--color') protected inputColorClass = false;
  @Input() public placeholder = '';
  @Input() public matTextSuffix?: string;
  @Input() public icon?: { position: 'prefix' | 'suffix'; icon: string };
  @Input() public min?: number | string;
  @Input() public max?: number | string;
  @Input() public matAutocomplete!: MatAutocomplete;
  @Input() public tabIndex = 0;
  @Input({ transform: booleanAttribute }) public clearable = false;
  @Input() public hint?: string;
  @Input() public set hintColor(value: HintColor) {
    this.hintClass = `app-input__hint--${value.toString()}`;
  }
  @Input() public requiredWhenDisabled: boolean = false;

  @Input() public set type(value: InputType) {
    this._type = value;
    this.inputColorClass = this._type === 'color';
  }

  public constructor(
    destroyRef: DestroyRef,
    formService: FormService,
    injector: Injector,
  ) {
    super(destroyRef, formService, injector);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['type'] &&
      changes['type'].firstChange &&
      changes['type'].currentValue === 'checkbox' &&
      !changes['subscriptSizing']
    ) {
      this.subscriptSizing = 'dynamic';
    }
  }
}
