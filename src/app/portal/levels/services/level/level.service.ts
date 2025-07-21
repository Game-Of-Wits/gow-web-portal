import { Injectable, inject } from '@angular/core'
import { LevelRepository } from '~/levels/repositories/level.repository'

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly levelRepository = inject(LevelRepository)
}
