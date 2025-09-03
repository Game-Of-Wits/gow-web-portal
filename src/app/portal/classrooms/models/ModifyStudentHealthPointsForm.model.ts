import { FormControl } from '@angular/forms'
import { PointsModifier } from '~/shared/models/PointsModifier'

export interface ModifyStudentHealthPointsForm {
  modifier: FormControl<PointsModifier>
  points: FormControl<number>
}
