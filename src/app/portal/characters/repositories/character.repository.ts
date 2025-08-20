import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { AbilityRepository } from '~/abilities/repositories/ability.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { TeamRepository } from '~/teams/repositories/team.repository'
import { CharacterDbModel } from '../models/CharacterDb.model'
import { CreateCharacter } from '../models/CreateCharacter.model'
import { UpdateCharacter } from '../models/UpdateCharacter.model'
import { UpdateCharacterDb } from '../models/UpdateCharacterDb.model'

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

  public async countByClassroomId(classroomId: string): Promise<number> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const charactersQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return (await getDocs(charactersQuery)).size
  }

  public async existById(id: string): Promise<boolean> {
    const characterRef = this.getRefById(id)
    const characterSnapshot = await getDoc(characterRef)
    return characterSnapshot.exists()
  }

  public async existByIdAndClassroom(id: string, classroomId: string) {
    const characterRef = this.getRefById(id)
    const characterSnaphost = await getDoc(characterRef)
    if (!characterSnaphost.exists()) return false
    const characterData = characterSnaphost.data() as CharacterDbModel
    return characterData.classroom.id === classroomId
  }

  public async create(data: CreateCharacter): Promise<CharacterDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )
    const teamRef = TeamRepository.getRefById(this.firestore, data.teamId)
    const abilityRefs = data.abilityIds.map(abilityId =>
      AbilityRepository.getRefById(this.firestore, abilityId)
    )

    const newCharacterRef = (await addDoc(this.getCollectionRef(), {
      classroom: classroomRef,
      team: teamRef,
      abilities: abilityRefs,
      name: data.name
    })) as DocumentReference<CharacterDbModel>

    const newCharacterSnapshot = await getDoc(newCharacterRef)

    return {
      id: newCharacterSnapshot.id,
      ...newCharacterSnapshot.data()
    } as CharacterDbModel
  }

  public async updateById(
    id: string,
    data: Partial<UpdateCharacter>
  ): Promise<void> {
    const characterRef = this.getRefById(id)

    const { teamId, classroomId, abilityIds, ...restData } = data
    const updateData: Partial<UpdateCharacterDb> = { ...restData }

    if (teamId)
      updateData.team = TeamRepository.getRefById(this.firestore, teamId)

    if (classroomId)
      updateData.classroom = ClassroomRepository.getRefById(
        this.firestore,
        classroomId
      )

    if (abilityIds)
      updateData.abilities = abilityIds.map(abilityId =>
        AbilityRepository.getRefById(this.firestore, abilityId)
      )

    await updateDoc(characterRef, updateData)
  }

  public async deleteById(id: string): Promise<void> {
    await deleteDoc(this.getRefById(id))
  }

  public async deleteAllByTeamId(teamId: string): Promise<void> {
    const teamRef = TeamRepository.getRefById(this.firestore, teamId)

    const charactersQuery = query(
      this.getCollectionRef(),
      where('team', '==', teamRef)
    )

    const charactersSnapshot = await getDocs(charactersQuery)

    if (charactersSnapshot.empty) return

    const deleteAllBatch = writeBatch(this.firestore)

    charactersSnapshot.forEach(answerOption => {
      deleteAllBatch.delete(answerOption.ref)
    })

    await deleteAllBatch.commit()
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
