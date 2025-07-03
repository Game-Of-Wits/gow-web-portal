import { DocumentReference } from '@angular/fire/firestore'
import { EducationLevel } from './EducationLevel.model'

export interface SchoolModel {
  id: string
  name: string
  classrooms: DocumentReference[]
  educationLevels: EducationLevel[]
  academicPeriods: DocumentReference[]
}

export type SchoolWithoutId = Omit<SchoolModel, 'id'>
