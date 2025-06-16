import { Injectable, inject } from '@angular/core'

import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from '@angular/fire/auth'

import { from } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth)

  public signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  public sendPasswordReset(email: string) {
    return from(sendPasswordResetEmail(this.auth, email))
  }
}
