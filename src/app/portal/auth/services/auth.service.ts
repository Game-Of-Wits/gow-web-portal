import { Injectable, inject } from '@angular/core'

import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth'

import { from } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fireAuth = inject(Auth)

  public signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.fireAuth, email, password))
  }

  public sendPasswordReset(email: string) {
    return from(sendPasswordResetEmail(this.fireAuth, email))
  }

  public signOut() {
    return from(signOut(this.fireAuth))
  }
}
