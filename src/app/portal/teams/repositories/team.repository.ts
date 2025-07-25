import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { TeamDbModel } from '../models/TeamDb.model'

@Injectable({ providedIn: 'root' })
export class TeamRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'teams'
  private readonly collectionName = TeamRepository.collectionName

  public getAllByClassroomId(classroomId: string): Observable<TeamDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const teamsQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return from(getDocs(teamsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          doc =>
            ({
              id: doc.id,
              ...doc.data()
            }) as TeamDbModel
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
    return collection(db, TeamRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${TeamRepository.collectionName}/${id}`)
  }
}
