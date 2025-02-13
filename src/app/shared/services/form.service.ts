import { Injectable } from '@angular/core';
import type { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  protected errorMessages!: Record<string, string>;

  public constructor() {
    this.translateErrors();
  }

  protected translateErrors(): void {
    this.errorMessages = {
      required: 'Requis',
    };
  }

  public getErrors(
    control: FormControl<unknown>,
    errorMessage: Record<string, string>,
  ): string {
    const { errors } = control;
    if (errors) {
      return Object.keys(errors)
        .reduce((acc, key) => {
          if (errorMessage && key in errorMessage) {
            acc.push(errorMessage[key] as never);
          } else if (key in this.errorMessages) {
            acc.push(this.errorMessages[key] as never);
          }
          return acc;
        }, [])
        .join(' ');
    }
    return '';
  }
}
