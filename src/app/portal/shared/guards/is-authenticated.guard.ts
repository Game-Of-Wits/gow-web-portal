import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { UserService } from '~/shared/services/user.service'
import { AuthStore } from '~/shared/store/auth.store'
import { AuthUserMapper } from '../mappers/auth-user.mapper'
import type { TeacherProfileModel } from '../models/TeacherProfile'

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore)
  const userService = inject(UserService)
  const router = inject(Router)

  if (authStore.isAuth() && authStore.authUser() !== null) {
    return true
  }

  try {
    const user = await userService.getAuthUser()

    if (!user) {
      router.navigate(['/'])
      return false
    }

    const profile = (await userService.getTeacherProfile(
      user.id
    )) as TeacherProfileModel

    const authUser = AuthUserMapper.toModel(user, profile)

    authStore.signIn(authUser)

    return true
  } catch {
    router.navigate(['/'])
    return false
  }
}
