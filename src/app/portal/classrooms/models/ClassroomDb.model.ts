import { DocumentReference } from '@angular/fire/firestore'

export interface ClassroomDbModel {
  id: string
  name: string
  students: DocumentReference[]
  teacher: DocumentReference
  school: DocumentReference
  gradeYear: DocumentReference
  isSetupReady: boolean
}

export type ClassroomDbWithoutId = Omit<ClassroomDbModel, 'id'>
