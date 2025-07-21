import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class InitialTeamsValidators {
  static noEqualTeamNames(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const firstTeamName = control.get('firstTeamName')?.value ?? ''
      const secondTeamName = control.get('secondTeamName')?.value ?? ''

      return firstTeamName !== secondTeamName
        ? null
        : { noEqualTeamNames: true }
    }
  }
}
