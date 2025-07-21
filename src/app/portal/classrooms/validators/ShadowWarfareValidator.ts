import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { CharacterForm } from '~/characters/models/CharacterForm.model'

export class ShadowWarfareValidator {
  static minimumOneCharacterPerTeam(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const teamsFormGroup = control.get('teams') as FormGroup<{
        firstTeamName: FormControl<string>
        secondTeamName: FormControl<string>
      }>

      const initialCharactersFormArray = control.get(
        'initialCharacters'
      ) as FormArray<FormGroup<CharacterForm>>

      const teamNames = teamsFormGroup.getRawValue()
      const initialCharacters = initialCharactersFormArray.getRawValue()

      const charactersPerTeam: { [key: string]: number } = {}

      for (const character of initialCharacters) {
        if (character.teamName === teamNames.firstTeamName) {
          charactersPerTeam[teamNames.firstTeamName] =
            charactersPerTeam[teamNames.firstTeamName] ?? 0 + 1
          continue
        }

        if (character.teamName === teamNames.secondTeamName) {
          charactersPerTeam[teamNames.secondTeamName] =
            charactersPerTeam[teamNames.secondTeamName] ?? 0 + 1
          continue
        }
      }

      const haveOneCharacterForEachTeam: boolean =
        (charactersPerTeam[teamNames.firstTeamName] ?? 0) >= 1 &&
        (charactersPerTeam[teamNames.secondTeamName] ?? 0) >= 1

      return haveOneCharacterForEachTeam
        ? null
        : { minimumOneCharacterPerTeam: true }
    }
  }
}
