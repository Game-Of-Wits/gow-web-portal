import { Injectable, inject } from '@angular/core'
import { Auth, authState } from '@angular/fire/auth'
import { firstValueFrom, map, take } from 'rxjs'
import { UserMapper } from '../mappers/user.mapper'
import { UserModel } from '../models/User'

@Injectable({ providedIn: 'root' })
export class UserService {
  private fireAuth = inject(Auth)

  public async getAuthUser(): Promise<UserModel> {
    return await firstValueFrom(
      authState(this.fireAuth).pipe(
        take(1),
        map(user => UserMapper.toModel(user))
      )
    )
  }
}
