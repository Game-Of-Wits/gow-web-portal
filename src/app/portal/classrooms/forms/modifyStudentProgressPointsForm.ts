import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { ModifyStudentHealthPointsForm } from '../models/ModifyStudentHealthPointsForm.model'

interface ModifyStudentProgressPointsDefaultValues {
  modifier: PointsModifier
  points: number
}

export const modifyStudentProgressPointsForm = (
  defaultValues?: Partial<ModifyStudentProgressPointsDefaultValues>
): FormGroup<ModifyStudentHealthPointsForm> => {
  return new FormGroup({
    modifier: new FormControl<PointsModifier>(
      defaultValues?.modifier ?? PointsModifier.DECREASE,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    points: new FormControl(defaultValues?.points ?? 0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1),
        FieldValidator.isNaN()
      ]
    })
  })
}
