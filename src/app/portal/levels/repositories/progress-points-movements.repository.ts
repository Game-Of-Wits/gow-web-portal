import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore } from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class ProgressPointsMovementsRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'progress_points_movements'
  private readonly collectionName =
    ProgressPointsMovementsRepository.collectionName

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static generateRef(db: Firestore) {
    return doc(this.getCollectionRef(db))
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, ProgressPointsMovementsRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${ProgressPointsMovementsRepository.collectionName}/${id}`)
  }
}
