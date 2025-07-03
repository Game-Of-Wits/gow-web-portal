import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthStore } from '../store/auth.store'

export const isNotAuthenticatedGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  if (!authStore.isAuth() && authStore.authUser() === null) return true

  router.navigate(['/p/general'])
  return false
}
