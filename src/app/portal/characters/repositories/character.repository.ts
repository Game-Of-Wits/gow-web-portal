import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore'
import { CharacterDbModel } from '../models/CharacterDb.model'

@Injectable({ providedIn: 'root' })
export class CharacterRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'abilities'
  private readonly collectionName = CharacterRepository.collectionName

  public async getByIdAsync(id: string): Promise<CharacterDbModel | null> {
    const characterRef = this.getRefById(id)
    const characterSnapshot = await getDoc(characterRef)

    if (!characterSnapshot.exists()) return null

    return {
      id: characterSnapshot.id,
      ...characterSnapshot.data()
    } as CharacterDbModel
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, CharacterRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${CharacterRepository.collectionName}/${id}`)
  }
}
