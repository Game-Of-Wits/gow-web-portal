import { FormControl } from '@angular/forms'

export interface LevelForm {
  name: FormControl<string>
  primaryColor: FormControl<string>
  requiredPoints: FormControl<number>
}
