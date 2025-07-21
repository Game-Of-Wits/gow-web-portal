import { Injectable, inject } from '@angular/core'
import { Firestore } from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class LevelRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'levels'
  private readonly collectionName = LevelRepository.collectionName
}
