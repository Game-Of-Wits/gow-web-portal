import { DocumentReference } from '@angular/fire/firestore'

export interface StudentDbModel {
  id: string
  profile: DocumentReference
  classroom: DocumentReference
  experiences: { [key: string]: DocumentReference }
}
