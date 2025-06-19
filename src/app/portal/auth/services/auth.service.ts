import { Injectable, inject } from '@angular/core'

import {
  Auth,
  authState,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from '@angular/fire/auth'

import { firstValueFrom, from, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fireAuth = inject(Auth)

  public signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.fireAuth, email, password))
  }

  public sendPasswordReset(email: string) {
    return from(sendPasswordResetEmail(this.fireAuth, email))
  }
}
