import { DocumentReference } from '@angular/fire/firestore'

export interface UpdateTeamDb {
  name: string
  classroom: DocumentReference
}
