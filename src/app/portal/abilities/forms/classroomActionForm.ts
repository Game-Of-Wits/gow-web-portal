import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddClassroomActionForm } from '~/abilities/models/AbilityForm.model'

export const classroomActionForm = (): FormGroup<AddClassroomActionForm> => {
  return new FormGroup<AddClassroomActionForm>({
    type: new FormControl(AbilityActionType.CLASSROOM, {
      nonNullable: true,
      validators: [Validators.required]
    })
  })
}
