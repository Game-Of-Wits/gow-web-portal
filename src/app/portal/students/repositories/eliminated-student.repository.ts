import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentReference,
  doc,
  Firestore
} from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class EliminatedStudentRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'eliminated_students'
  private readonly collectionName = EliminatedStudentRepository.collectionName

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static generateRef(db: Firestore): DocumentReference {
    return doc(EliminatedStudentRepository.getCollectionRef(db))
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, EliminatedStudentRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${EliminatedStudentRepository.collectionName}/${id}`)
  }
}
