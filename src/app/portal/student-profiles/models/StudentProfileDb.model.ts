import { DocumentReference } from '@angular/fire/firestore'

export interface StudentProfileDbModel {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  classrooms: DocumentReference[]
}
