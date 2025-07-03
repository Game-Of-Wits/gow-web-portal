import { Injectable, inject } from '@angular/core'
import { Auth, authState } from '@angular/fire/auth'
import {
  DocumentReference,
  doc,
  docData,
  Firestore,
  getDoc
} from '@angular/fire/firestore'
import { firstValueFrom, map, take } from 'rxjs'
import { UserMapper } from '../mappers/user.mapper'
import { TeacherProfileModel } from '../models/TeacherProfile'

@Injectable({ providedIn: 'root' })
export class UserService {
  private fireAuth = inject(Auth)
  private firestore = inject(Firestore)

  public getAuthUser() {
    return firstValueFrom(
      authState(this.fireAuth).pipe(
        take(1),
        map(user => UserMapper.toModel(user))
      )
    )
  }

  public getTeacherProfile(userId: string) {
    const profileRef = doc(
      this.firestore,
      `teacher_profiles/${userId}`
    ) as DocumentReference<TeacherProfileModel>
    return firstValueFrom(docData(profileRef, { idField: 'id' }))
  }

  public async isTeacher(userId: string) {
    const profileRef = doc(
      this.firestore,
      `teacher_profiles/${userId}`
    ) as DocumentReference<TeacherProfileModel>
    const profile = await getDoc(profileRef)
    return profile.exists()
  }
}
