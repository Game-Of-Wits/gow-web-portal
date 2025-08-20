import { FormControl } from '@angular/forms'

export interface CreateStudentForm {
  firstName: FormControl<string>
  lastName: FormControl<string>
  phoneNumber: FormControl<string>
  email: FormControl<string>
  password: FormControl<string>
  character: FormControl<string | null>
}
