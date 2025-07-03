import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { SchoolModel } from '~/schools/models/School.model'
import { SchoolRepository } from '~/schools/repositories/school.repository'

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly schoolRepository = inject(SchoolRepository)

  public getFirstSchool(): Observable<SchoolModel | null> {
    return this.schoolRepository
      .getAllSchools()
      .pipe(map(school => school[0] ?? null))
  }
}
