import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { SchoolModel } from '~/schools/models/School.model'
import { SchoolGradeYearModel } from '~/schools/models/SchoolGradeYear.model'

type DefaultSchoolState = {
  school: SchoolModel | null
  gradeYears: SchoolGradeYearModel[] | null
}

const initialState: DefaultSchoolState = {
  school: null,
  gradeYears: null
}

export const DefaultSchoolStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    setSchool(school: SchoolModel): void {
      patchState(store, state => ({ ...state, school }))
    },
    setSchoolGradeYears(gradeYears: SchoolGradeYearModel[]): void {
      patchState(store, state => ({ ...state, gradeYears }))
    }
  }))
)
