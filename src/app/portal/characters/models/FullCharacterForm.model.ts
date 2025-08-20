import { FormControl } from '@angular/forms'

export interface FullCharacterForm {
  name: FormControl<string>
  team: FormControl<string>
  abilities: FormControl<string[]>
}
