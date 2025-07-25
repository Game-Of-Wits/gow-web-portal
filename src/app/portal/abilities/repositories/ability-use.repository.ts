import { Injectable, inject } from '@angular/core'
import { Database, onValue, ref } from '@angular/fire/database'
import { Observable } from 'rxjs'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityUseDbModel } from '../models/AbilityUseDb.model'

@Injectable({ providedIn: 'root' })
export class AbilityUseRepository {
  private readonly db = inject(Database)

  public getAllByExperienceAndExperienceSessionId(
    experienceSessionId: string,
    experience: EducationalExperience
  ): Observable<AbilityUseDbModel[]> {
    return new Observable(observer => {
      const abilityUsesRef = ref(
        this.db,
        `educationalExperiences/${experience}/sessions/${experienceSessionId}/abilityUses`
      )

      const unsubscribe = onValue(
        abilityUsesRef,
        snapshot => {
          const data = snapshot.val()
          const abilityUses: AbilityUseDbModel[] = data
            ? Object.values(data)
            : []
          observer.next(abilityUses)
        },
        error => {
          observer.error(error)
        }
      )

      return () => unsubscribe()
    })
  }
}
