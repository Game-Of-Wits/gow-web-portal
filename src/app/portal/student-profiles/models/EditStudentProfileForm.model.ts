import { FormControl } from '@angular/forms'

export interface EditStudentProfileForm {
  firstName: FormControl<string>
  lastName: FormControl<string>
  phoneNumber: FormControl<string>
}
