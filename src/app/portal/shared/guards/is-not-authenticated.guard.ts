import { inject } from '@angular/core'
import { Auth, onAuthStateChanged } from '@angular/fire/auth'
import { CanActivateFn, Router, UrlTree } from '@angular/router'
import { AuthStore } from '~/shared/store/auth.store'
import { TeacherProfileModel } from '~/teacher-profile/models/TeacherProfile.model'
import { TeacherProfileService } from '~/teacher-profile/services/teacher-profile/teacher-profile.service'
import { AuthUserMapper } from '../mappers/auth-user.mapper'
import { UserMapper } from '../mappers/user.mapper'

export const isNotAuthenticatedGuard: CanActivateFn = async (): Promise<
  boolean | UrlTree
> => {
  const router = inject(Router)
  const auth = inject(Auth)
  const teacherProfileService = inject(TeacherProfileService)
  const authStore = inject(AuthStore)

  return new Promise<boolean | UrlTree>(resolve => {
    onAuthStateChanged(auth, async user => {
      if (user === null) return resolve(true)

      let teacherProfile: TeacherProfileModel

      try {
        teacherProfile = await teacherProfileService.getTeacherProfileById(
          user.uid
        )

        const userMapped = UserMapper.toModel(user)
        const authUser = AuthUserMapper.toModel(userMapped, teacherProfile)

        authStore.signIn(authUser)

        router.navigate(['/p/general'])
        return resolve(false)
      } catch (_err) {
        await auth.signOut()
        return resolve(true)
      }
    })
  })
}
