import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthStore } from '~/shared/store/auth.store'

import { AuthUserMapper } from '~/shared/mappers/auth-user.mapper'
import { UserService } from '~/shared/services/user.service'

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore)
  const userService = inject(UserService)
  const router = inject(Router)

  try {
    const userData = await userService.getAuthUser()
    const authUser = AuthUserMapper.toModel(userData)

    if (authUser) {
      authStore.signIn(authUser)
      return true
    }

    router.navigate(['/'])
    return false
  } catch {
    router.navigate(['/'])
    return false
  }
}
