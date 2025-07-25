import { Injectable, inject } from '@angular/core'
import { Observable, switchMap } from 'rxjs'
import { AbilityUseMapper } from '~/abilities/mappers/ability-use.mapper'
import { AbilityUseModel } from '~/abilities/models/AbilityUse.model'
import { AbilityUseRepository } from '~/abilities/repositories/ability-use.repository'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

@Injectable({ providedIn: 'root' })
export class AbilityUseService {
  private readonly abilityUseRepository = inject(AbilityUseRepository)

  private readonly abilityUseMapper = inject(AbilityUseMapper)

  public getAllAbilityUsesByExperienceAndExperienceSessionId({
    experienceSessionId,
    experience
  }: {
    experience: EducationalExperience
    experienceSessionId: string
  }): Observable<AbilityUseModel[]> {
    return this.abilityUseRepository
      .getAllByExperienceAndExperienceSessionId(experienceSessionId, experience)
      .pipe(
        switchMap(abilityUses => this.abilityUseMapper.toListModel(abilityUses))
      )
  }
}
