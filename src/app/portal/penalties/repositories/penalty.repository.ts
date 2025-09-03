import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  DocumentSnapshot,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { CreatePenalty } from '../models/CreatePenalty.model'
import { PenaltyDbModel } from '../models/PenaltyDb.model'
import { UpdatePenalty } from '../models/UpdatePenalty.model'
import { UpdatePenaltyDb } from '../models/UpdatePenaltyDb.model'

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

    const penaltiesQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return from(getDocs(penaltiesQuery)).pipe(
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

  public async getAllByClassroomIdAsync(
    classroomId: string
  ): Promise<PenaltyDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const penaltiesQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    const penaltiesSnapshot = await getDocs(penaltiesQuery)

    return penaltiesSnapshot.docs.map(
      doc => ({ ...doc.data(), id: doc.id }) as PenaltyDbModel
    )
  }

  public async getByIdAsync(id: string): Promise<PenaltyDbModel | null> {
    const penaltyRef = this.getRefById(id)
    const penaltySnapshot = await getDoc(penaltyRef)
    if (!penaltySnapshot.exists()) return null
    return {
      ...penaltySnapshot.data(),
      id: penaltySnapshot.id
    } as PenaltyDbModel
  }

  public async existsById(id: string): Promise<boolean> {
    const penaltyRef = this.getRefById(id)
    const penaltySnapshot = await getDoc(penaltyRef)
    return penaltySnapshot.exists()
  }

  public async create(data: CreatePenalty): Promise<PenaltyDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newPenaltyRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      reducePoints: data.reducePoints,
      classroom: classroomRef
    })) as DocumentReference<PenaltyDbModel>

    const newPenaltySnapshot: DocumentSnapshot<PenaltyDbModel> =
      await getDoc(newPenaltyRef)

    return {
      id: newPenaltySnapshot.id,
      ...newPenaltySnapshot.data()
    } as PenaltyDbModel
  }

  public async updateById(
    id: string,
    data: Partial<UpdatePenalty>
  ): Promise<void> {
    const updateData: Partial<UpdatePenaltyDb> = {}

    if (data.classroomId !== undefined)
      updateData['classroom'] = ClassroomRepository.getRefById(
        this.firestore,
        data.classroomId
      )

    if (data.name !== undefined) updateData['name'] = data.name

    if (data.reducePoints !== undefined)
      updateData['reducePoints'] = data.reducePoints

    await updateDoc(this.getRefById(id), updateData)
  }

  public async deleteById(id: string): Promise<void> {
    await deleteDoc(this.getRefById(id))
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
