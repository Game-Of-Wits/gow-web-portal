import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore } from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class HomeworkAnswerRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'homework_answers'
  private readonly collectionName = HomeworkAnswerRepository.collectionName

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  public getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, HomeworkAnswerRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${HomeworkAnswerRepository.collectionName}/${id}`)
  }
}
