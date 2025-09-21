import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore } from '@angular/fire/firestore'

@Injectable({ providedIn: 'root' })
export class StudentHomeworkRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'student_homeworks'
  private readonly collectionName = StudentHomeworkRepository.collectionName

  public generateRef() {
    return doc(this.getCollectionRef())
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  public getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentHomeworkRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentHomeworkRepository.collectionName}/${id}`)
  }

  public static generateRef(db: Firestore) {
    return doc(StudentHomeworkRepository.getCollectionRef(db))
  }
}
