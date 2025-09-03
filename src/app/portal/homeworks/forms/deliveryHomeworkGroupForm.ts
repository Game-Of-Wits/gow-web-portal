import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { DeliveryHomeworkGroupForm } from '../models/DeliveryHomeworkGroupForm.model'

export const deliveryHomeworkGroupForm =
  (): FormGroup<DeliveryHomeworkGroupForm> => {
    return new FormGroup({
      baseDateLimit: new FormControl(new Date(), {
        nonNullable: true,
        validators: [Validators.required, FieldValidator.isFutureDate()]
      })
    })
  }
