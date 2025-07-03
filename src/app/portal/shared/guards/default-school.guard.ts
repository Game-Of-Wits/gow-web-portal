import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { catchError, firstValueFrom, of, switchMap } from 'rxjs'
import { SchoolService } from '~/schools/services/school/school.service'
import { SchoolGradeYearService } from '~/schools/services/school-grade-year/school-grade-year.service'
import { DefaultSchoolStore } from '../store/default-school.store'

export const getDefaultSchoolGuard: CanActivateFn = () => {
  const schoolService = inject(SchoolService)
  const schoolGradeYearService = inject(SchoolGradeYearService)
  const defaultSchoolStore = inject(DefaultSchoolStore)
  const router = inject(Router)

  return schoolService.getFirstSchool().pipe(
    switchMap(async school => {
      if (school == null) return router.parseUrl('/')

      defaultSchoolStore.setSchool(school)

      try {
        const gradeYears = await firstValueFrom(
          schoolGradeYearService.getGradeYearBySchool(school.id)
        )
        defaultSchoolStore.setSchoolGradeYears(gradeYears)

        return true
      } catch {
        router.parseUrl('/')
        return false
      }
    }),
    catchError(() => {
      return of(router.parseUrl('/'))
    })
  )
}
