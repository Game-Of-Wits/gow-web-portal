import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AuthUserModel } from '~/shared/models/AuthUser'

type AuthState = {
  authUser: AuthUserModel | null
  isAuth: boolean
}

const initialState: AuthState = {
  isAuth: false,
  authUser: null
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    signIn(user: AuthUserModel): void {
      patchState(store, () => ({ authUser: user, isAuth: true }))
    },
    logOut(): void {
      patchState(store, () => ({ authUser: null, isAuth: false }))
    }
  }))
)
