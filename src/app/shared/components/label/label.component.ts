import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
  @Input() public for!: string;
  @Input() public required!: boolean;
}
