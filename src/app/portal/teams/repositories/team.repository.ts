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
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { CreateTeam } from '../models/CreateTeam.model'
import { TeamDbModel } from '../models/TeamDb.model'
import { UpdateTeam } from '../models/UpdateTeam.model'
import { UpdateTeamDb } from '../models/UpdateTeamDb.model'

@Injectable({ providedIn: 'root' })
export class TeamRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'teams'
  private readonly collectionName = TeamRepository.collectionName

  public async getById(id: string): Promise<TeamDbModel | null> {
    const teamRef = this.getRefById(id)

    const teamSnaphost = await getDoc(teamRef)
    if (!teamSnaphost.exists()) return null

    return {
      id: teamSnaphost.id,
      ...teamSnaphost.data()
    } as TeamDbModel
  }

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

  public async countByClassroomId(classroomId: string): Promise<number> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const teamsQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    return (await getDocs(teamsQuery)).size
  }

  public async existById(id: string): Promise<boolean> {
    const teamRef = this.getRefById(id)
    const teamSnaphost = await getDoc(teamRef)
    return teamSnaphost.exists()
  }

  public async existByIdAndClassroom(id: string, classroomId: string) {
    const teamRef = this.getRefById(id)
    const teamSnaphost = await getDoc(teamRef)
    if (!teamSnaphost.exists()) return false
    const teamData = teamSnaphost.data() as TeamDbModel
    return teamData.classroom.id === classroomId
  }

  public async create(data: CreateTeam): Promise<TeamDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newTeamRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      classroom: classroomRef,
      characters: []
    })) as DocumentReference<TeamDbModel>

    const teamSnapshot = await getDoc(newTeamRef)

    return {
      id: teamSnapshot.id,
      ...teamSnapshot.data()
    } as TeamDbModel
  }

  public async updateById(
    id: string,
    data: Partial<UpdateTeam>
  ): Promise<void> {
    const { classroomId, name } = data
    const updateData: Partial<UpdateTeamDb> = { name }

    if (classroomId) {
      const classroomRef = ClassroomRepository.getRefById(
        this.firestore,
        classroomId
      )
      updateData.classroom = classroomRef
    }

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
    return collection(db, TeamRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${TeamRepository.collectionName}/${id}`)
  }
}
