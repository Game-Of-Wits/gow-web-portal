import { Injectable, inject } from '@angular/core'
import { Firestore } from '@angular/fire/firestore'
import { collection, doc, getDocs, query, where } from '@firebase/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { PenaltyDbModel } from '../models/PenaltyDb.model'

@Injectable({ providedIn: 'root' })
export class PenaltyRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'penalties'
  private readonly collectionName = PenaltyRepository.collectionName

  public getAllByClassroomId(
    classroomId: string
  ): Observable<PenaltyDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const charactersQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return from(getDocs(charactersQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          doc =>
            ({
              id: doc.id,
              ...doc.data()
            }) as PenaltyDbModel
        )
      )
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, PenaltyRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${PenaltyRepository.collectionName}/${id}`)
  }
}
