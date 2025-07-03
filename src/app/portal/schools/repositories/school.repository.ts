import { Injectable, inject } from '@angular/core'
import {
  CollectionReference,
  collection,
  collectionData,
  DocumentReference,
  doc,
  docData,
  Firestore
} from '@angular/fire/firestore'
import type { SchoolModel } from '~/schools/models/School.model'

@Injectable({ providedIn: 'root' })
export class SchoolRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'schools'
  private readonly collectionName = SchoolRepository.collectionName

  public getSchoolById(schoolId: string) {
    const schoolRef = doc(
      this.firestore,
      `${this.collectionName}/${schoolId}`
    ) as DocumentReference<SchoolModel>
    return docData(schoolRef, { idField: 'id' })
  }

  public getAllSchools() {
    const schoolsRef = collection(
      this.firestore,
      this.collectionName
    ) as CollectionReference<SchoolModel>
    return collectionData<SchoolModel>(schoolsRef, { idField: 'id' })
  }

  public static getSchoolRefById(db: Firestore, id: string) {
    return doc(db, `${SchoolRepository.collectionName}/${id}`)
  }
}
