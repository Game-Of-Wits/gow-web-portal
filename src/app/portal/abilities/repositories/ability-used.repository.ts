import { Injectable, inject } from '@angular/core'
import { collection, Firestore } from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class AbilityUsedRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'ability'
  private readonly collectionName = StudentRepository.collectionName
}
