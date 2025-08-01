import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import type { SchoolModel } from '~/schools/models/School.model'

@Injectable({ providedIn: 'root' })
export class SchoolRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'schools'
  private readonly collectionName = SchoolRepository.collectionName

  public getSchoolById(schoolId: string): Observable<SchoolModel> {
    const schoolRef = this.getRefById(schoolId)

    return from(getDoc(schoolRef)).pipe(
      map(snapshot => ({ id: snapshot.id, ...snapshot.data() }) as SchoolModel)
    )
  }

  public getAllSchools() {
    const schoolsRef = this.getCollectionRef()
    return from(getDocs(schoolsRef)).pipe(
      map(snapshots =>
        snapshots.docs.map(
          doc => ({ id: doc.id, ...doc.data() }) as SchoolModel
        )
      )
    )
  }

  public static getSchoolRefById(db: Firestore, id: string) {
    return doc(db, `${SchoolRepository.collectionName}/${id}`)
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, SchoolRepository.collectionName)
  }
}
