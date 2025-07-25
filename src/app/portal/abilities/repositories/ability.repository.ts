import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore'
import { AbilityDbModel } from '../models/AbilityDb.model'

@Injectable({ providedIn: 'root' })
export class AbilityRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'abilities'
  private readonly collectionName = AbilityRepository.collectionName

  public async getByIdAsync(id: string): Promise<AbilityDbModel | null> {
    const abilityRef = this.getRefById(id)
    const abilitySnapshot = await getDoc(abilityRef)

    if (!abilitySnapshot.exists()) return null

    return {
      id: abilitySnapshot.id,
      ...abilitySnapshot.data()
    } as AbilityDbModel
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, AbilityRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${AbilityRepository.collectionName}/${id}`)
  }
}
