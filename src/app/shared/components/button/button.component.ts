import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ButtonBaseDirective, ButtonColor } from './button-base.directive';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss', './button-base.scss'],
  imports: [MatButton],
})
export class ButtonComponent extends ButtonBaseDirective {
  @Input() public color: ButtonColor = 'default';
}
