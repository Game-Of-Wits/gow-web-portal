import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { UserService } from '~/shared/services/user.service'

export const isNotAuthenticatedGuard: CanActivateFn = async () => {
  const authService = inject(UserService)
  const router = inject(Router)

  try {
    const user = await authService.getAuthUser()

    if (user) {
      router.navigate(['/p/general'])
      return false
    }

    return true
  } catch {
    return true
  }
}
