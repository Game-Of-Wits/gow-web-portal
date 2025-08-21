import { Injectable, inject } from '@angular/core'
import {
  Auth,
  AuthError,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth'
import { ErrorResponse } from '@shared/types/ErrorResponse'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fireAuth = inject(Auth)

  public async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.fireAuth, email, password)
    } catch (err) {
      const error = err as AuthError
      throw new ErrorResponse(error.code)
    }
  }

  public async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.fireAuth, email)
    } catch (err) {
      const error = err as AuthError
      throw new ErrorResponse(error.code)
    }
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(this.fireAuth)
    } catch (err) {
      const error = err as AuthError
      throw new ErrorResponse(error.code)
    }
  }
}
