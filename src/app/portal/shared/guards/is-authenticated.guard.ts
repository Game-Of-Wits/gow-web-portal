import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { UserService } from '~/shared/services/user.service'

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const userService = inject(UserService)
  const router = inject(Router)

  try {
    const user = await userService.getAuthUser()

    if (user) return true

    router.navigate(['/'])
    return false
  } catch {
    router.navigate(['/'])
    return false
  }
}
