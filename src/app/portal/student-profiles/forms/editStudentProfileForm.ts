import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { EditStudentProfileForm } from '../models/EditStudentProfileForm.model'
import { EditStudentProfileFormData } from '../models/EditStudentProfileFormData.model'

export const editStudentProfileForm = (
  defaultValues?: EditStudentProfileFormData
): FormGroup<EditStudentProfileForm> => {
  return new FormGroup<EditStudentProfileForm>({
    firstName: new FormControl(defaultValues?.firstName ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    }),
    lastName: new FormControl(defaultValues?.lastName ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    }),
    phoneNumber: new FormControl(defaultValues?.phoneNumber ?? '', {
      nonNullable: true,
      validators: [Validators.required, FieldValidator.isPhoneNumber()]
    })
  })
}
