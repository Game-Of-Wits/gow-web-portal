import { FormControl } from '@angular/forms'

export interface PenaltyForm {
  name: FormControl<string>
  reducePoints: FormControl<number>
}
