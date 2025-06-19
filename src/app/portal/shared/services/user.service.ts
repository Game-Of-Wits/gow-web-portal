import { Injectable, inject } from '@angular/core'

import { Auth, authState } from '@angular/fire/auth'

import { firstValueFrom, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class UserService {
  private fireAuth = inject(Auth)

  public getAuthUser() {
    return firstValueFrom(authState(this.fireAuth).pipe(take(1)))
  }
}
