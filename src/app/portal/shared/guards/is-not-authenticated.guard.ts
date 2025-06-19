import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthService } from '~/auth/services/auth.service'

export const isNotAuthenticatedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService)
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
