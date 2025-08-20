import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  deleteDoc,
  doc,
  documentId,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore'
import { chuckArray } from '@shared/utils/chuckArray'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityDbModel } from '../models/AbilityDb.model'
import { CreateAbility } from '../models/CreateAbility.model'
import { UpdateAbility } from '../models/UpdateAbility.model'
import { UpdateAbilityDb } from '../models/UpdateAbilityDb.model'

@Injectable({ providedIn: 'root' })
export class AbilityRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'abilities'
  private readonly collectionName = AbilityRepository.collectionName

  public async getByIdAsync(id: string): Promise<AbilityDbModel | null> {
    const abilityRef = this.getRefById(id)
    const abilitySnapshot = await getDoc(abilityRef)

    if (!abilitySnapshot.exists()) return null

    return {
      id: abilitySnapshot.id,
      ...abilitySnapshot.data()
    } as AbilityDbModel
  }

  public async getAllByClassroomIdAndExperienceAsync(
    classroomId: string,
    experience: EducationalExperience
  ): Promise<AbilityDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const abilitiesQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef),
      where('experience', '==', experience),
      where('isInitial', '==', false)
    )

    const abilitiesSnapshot = await getDocs(abilitiesQuery)

    return abilitiesSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data()
        }) as AbilityDbModel
    )
  }

  public async getAllByClassroomIdAsync(
    classroomId: string
  ): Promise<AbilityDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const abilitiesQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    const abilitiesSnapshot = await getDocs(abilitiesQuery)

    return abilitiesSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data()
        }) as AbilityDbModel
    )
  }

  public async existById(id: string): Promise<boolean> {
    const abilityRef = this.getRefById(id)
    const abilitySnapshot = await getDoc(abilityRef)
    return abilitySnapshot.exists()
  }

  public async existAllByIds(ids: string[]): Promise<boolean> {
    const collection = this.getCollectionRef()

    const chunks = chuckArray(ids, 10)
    let foundCount = 0

    for (const part of chunks) {
      const q = query(collection, where(documentId(), 'in', part))
      const snapshot = await getDocs(q)
      foundCount += snapshot.size
    }

    return foundCount === ids.length
  }

  public async existAllByIdsAndClassroom(
    ids: string[],
    classroomId: string
  ): Promise<boolean> {
    const collection = this.getCollectionRef()
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const chunks = chuckArray(ids, 10)
    let foundCount = 0

    for (const part of chunks) {
      const q = query(
        collection,
        where(documentId(), 'in', part),
        where('classroom', '==', classroomRef)
      )
      const snapshot = await getDocs(q)
      foundCount += snapshot.size
    }

    return foundCount === ids.length
  }

  public async create(data: CreateAbility): Promise<AbilityDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newAbililityRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      type: data.type,
      description: data.description,
      classroom: classroomRef,
      isInitial: data.isInitial,
      experience: data.experience,
      usage: data.usage,
      actions: data.actions
    })) as DocumentReference<AbilityDbModel>

    const newAbililitySnapshot = await getDoc(newAbililityRef)

    return {
      id: newAbililitySnapshot.id,
      ...newAbililitySnapshot.data()
    } as AbilityDbModel
  }

  public async updateById(id: string, data: Partial<UpdateAbility>) {
    const abilityRef = this.getRefById(id)

    const updateData: Partial<UpdateAbilityDb> = { ...data }

    if (data.classroomId !== undefined) {
      const classroomRef = ClassroomRepository.getRefById(
        this.firestore,
        data.classroomId
      )
      updateData.classroom = classroomRef
    }

    await updateDoc(abilityRef, updateData)
  }

  public async deleteById(id: string) {
    await deleteDoc(this.getRefById(id))
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, AbilityRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${AbilityRepository.collectionName}/${id}`)
  }
}
