import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { CharacterForm } from '~/characters/models/CharacterForm.model'
import { levelForm } from '~/levels/forms'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { MasteryRoadLevelsFormValidator } from '~/levels/validators/MasteryRoadLevelsFormValidator'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { MasteryRoadPenaltiesFormValidator } from '~/penalties/validations/MasteryRoadPenaltiesFormValidator'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import {
  CreateClassroomForm,
  CreateClassroomMasteryRoadExperienceForm,
  CreateClassroomShadowWarfareExperienceForm
} from '../models/CreateClassroomForm.model'
import { InitialAbilitiesValidator } from '../validators/InitialAbilitiesValidator'
import { InitialTeamsValidators } from '../validators/InitialTeamsValidators'
import { ShadowWarfareValidator } from '../validators/ShadowWarfareValidator'

export const classroomForm = (
  fb: FormBuilder
): FormGroup<CreateClassroomForm> => {
  return fb.nonNullable.group<CreateClassroomForm>({
    name: fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),
    gradeYearId: fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(20)
    ]),
    experiences: fb.nonNullable.group({
      SHADOW_WARFARE:
        fb.nonNullable.group<CreateClassroomShadowWarfareExperienceForm>(
          {
            teams: fb.nonNullable.group(
              {
                firstTeamName: fb.nonNullable.control('', [
                  Validators.required,
                  Validators.minLength(2),
                  Validators.maxLength(30)
                ]),
                secondTeamName: fb.nonNullable.control('', [
                  Validators.required,
                  Validators.minLength(2),
                  Validators.maxLength(30)
                ])
              },
              { validators: [InitialTeamsValidators.noEqualTeamNames()] }
            ),
            character: fb.nonNullable.group({
              healthPointsBase: fb.nonNullable.control(0, [
                Validators.required,
                Validators.min(1),
                FieldValidator.isNaN()
              ]),
              limitAbilities: fb.nonNullable.control(0, [
                Validators.required,
                Validators.min(1),
                Validators.max(10),
                FieldValidator.isNaN()
              ])
            }),
            initialCharacters: fb.nonNullable.array<FormGroup<CharacterForm>>(
              [],
              [Validators.required]
            ),
            initialAbilities: fb.nonNullable.array<FormGroup<AbilityForm>>(
              [],
              [
                Validators.required,
                InitialAbilitiesValidator.noEqualNames()
              ]
            )
          },
          { validators: [ShadowWarfareValidator.minimumOneCharacterPerTeam()] }
        ),
      MASTERY_ROAD:
        fb.nonNullable.group<CreateClassroomMasteryRoadExperienceForm>({
          levels: fb.nonNullable.group(
            {
              initialLevel: levelForm({ requiredPoints: 0, max: null }),
              list: fb.nonNullable.array<FormGroup<LevelForm>>(
                [],
                [Validators.required, Validators.minLength(1)]
              )
            },
            {
              validators: [
                MasteryRoadLevelsFormValidator.noEqualPrimaryColors(),
                MasteryRoadLevelsFormValidator.noEqualNames()
              ]
            }
          ),
          penalties: fb.nonNullable.array<FormGroup<PenaltyForm>>(
            [],
            [
              Validators.required,
              Validators.minLength(1),
              MasteryRoadPenaltiesFormValidator.noEqualNames()
            ]
          )
        })
    })
  })
}
