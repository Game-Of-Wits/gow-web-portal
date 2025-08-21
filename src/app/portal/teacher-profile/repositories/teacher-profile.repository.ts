import { Injectable, inject } from '@angular/core'
import { doc, Firestore, getDoc } from '@angular/fire/firestore'
import { TeacherProfileDbModel } from '../models/TeacherProfileDb.model'

@Injectable({ providedIn: 'root' })
export class TeacherProfileRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'teacher_profiles'
  private readonly collectionName = TeacherProfileRepository.collectionName

  public async getTeacherProfileById(
    userId: string
  ): Promise<TeacherProfileDbModel | null> {
    const profileRef = TeacherProfileRepository.getRefById(
      this.firestore,
      userId
    )
    const profileSnapshot = await getDoc(profileRef)
    if (!profileSnapshot.exists()) return null
    return {
      id: profileSnapshot.id,
      ...profileSnapshot.data()
    } as TeacherProfileDbModel
  }

  public async existById(userId: string) {
    const profileRef = this.getRefById(userId)
    const profile = await getDoc(profileRef)
    return profile.exists()
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${TeacherProfileRepository.collectionName}/${id}`)
  }

  public getRefById(id: string) {
    return doc(
      this.firestore,
      `${TeacherProfileRepository.collectionName}/${id}`
    )
  }
}
