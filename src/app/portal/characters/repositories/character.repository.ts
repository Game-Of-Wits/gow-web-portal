import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { CharacterDbModel } from '../models/CharacterDb.model'

@Injectable({ providedIn: 'root' })
export class CharacterRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'characters'
  private readonly collectionName = CharacterRepository.collectionName

  public async getByIdAsync(id: string): Promise<CharacterDbModel | null> {
    const characterRef = this.getRefById(id)
    const characterSnapshot = await getDoc(characterRef)

    if (!characterSnapshot.exists()) return null

    return {
      id: characterSnapshot.id,
      ...characterSnapshot.data()
    } as CharacterDbModel
  }

  public getAllByClassroomId(
    classroomId: string
  ): Observable<CharacterDbModel[]> {
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
            }) as CharacterDbModel
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
    return collection(db, CharacterRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${CharacterRepository.collectionName}/${id}`)
  }
}
