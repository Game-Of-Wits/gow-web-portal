import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TeamForm } from '../models/TeamForm.model'
import { TeamFormData } from '../models/TeamFormData.model'

export const teamForm = (defaultValues?: TeamFormData): FormGroup<TeamForm> => {
  return new FormGroup({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]
    })
  })
}
