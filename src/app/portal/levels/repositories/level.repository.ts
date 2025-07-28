import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  DocumentSnapshot,
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
import { from, map } from 'rxjs'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityDbModel } from '~/abilities/models/AbilityDb.model'
import { AbilityRepository } from '~/abilities/repositories/ability.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { CreateLevelModel } from '../models/CreateLevel.model'
import { LevelDbModel } from '../models/LevelDb.model'

@Injectable({ providedIn: 'root' })
export class LevelRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'levels'
  private readonly collectionName = LevelRepository.collectionName

  public async getByIdAsync(id: string): Promise<LevelDbModel | null> {
    const levelRef = this.getRefById(id)
    const levelSnapshot = await getDoc(levelRef)

    if (!levelSnapshot.exists()) return null

    return {
      id: levelSnapshot.id,
      ...levelSnapshot.data()
    } as LevelDbModel
  }

  public getAllByClassroomId(classroomId: string) {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const levelsQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return from(getDocs(levelsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          doc =>
            ({
              id: doc.id,
              ...doc.data()
            }) as LevelDbModel
        )
      )
    )
  }

  public async getAllAbilitiesFromLevelIdAsync(
    levelId: string
  ): Promise<AbilityDbModel[]> {
    const levelRef = this.getRefById(levelId)
    const levelSnapshot = await getDoc(levelRef)

    if (!levelSnapshot.exists()) return []

    const levelData = levelSnapshot.data() as LevelDbModel
    const abilityIds = levelData.abilities

    if (!abilityIds || abilityIds.length === 0) return []

    const abilityChunks = chuckArray(abilityIds, 10)
    const abilitySnapshots: DocumentSnapshot[] = []

    const chunkPromises = abilityChunks.map(async chunk => {
      const abilitiesQuery = query(
        AbilityRepository.getCollectionRef(this.firestore),
        where(documentId(), 'in', chunk)
      )
      return await getDocs(abilitiesQuery)
    })

    const querySnapshots = await Promise.all(chunkPromises)

    querySnapshots.forEach(querySnapshot => {
      querySnapshot.docs.forEach(doc => abilitySnapshots.push(doc))
    })

    const abilities: AbilityDbModel[] = abilitySnapshots
      .filter(snapshot => snapshot.exists())
      .map(
        snapshot =>
          ({
            id: snapshot.id,
            ...snapshot.data()
          }) as AbilityModel
      )

    return abilities
  }

  public async create(data: CreateLevelModel): Promise<LevelDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newLevelRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      requiredPoints: data.requiredPoints,
      primaryColor: data.primaryColor,
      classroom: classroomRef,
      abilities: []
    })) as DocumentReference<LevelDbModel>

    const newLevelSnapshot: DocumentSnapshot<LevelDbModel> =
      await getDoc(newLevelRef)

    return {
      id: newLevelSnapshot.id,
      ...newLevelSnapshot.data()
    } as LevelDbModel
  }

  public async updateByIdAsync(levelId: string, data: Partial<LevelDbModel>) {
    await updateDoc(this.getRefById(levelId), data)
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, LevelRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${LevelRepository.collectionName}/${id}`)
  }
}
