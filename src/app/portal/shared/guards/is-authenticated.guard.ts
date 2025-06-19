import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthService } from '~/auth/services/auth.service'

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  try {
    const user = await authService.getAuthUser()

    if (user) return true

    router.navigate(['/'])
    return false
  } catch {
    router.navigate(['/'])
    return false
  }
}
