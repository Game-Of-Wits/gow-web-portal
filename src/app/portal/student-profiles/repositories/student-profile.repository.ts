import { Injectable, inject } from '@angular/core'
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore'
import { StudentProfileDbModel } from '../models/StudentProfileDb.model'

@Injectable({ providedIn: 'root' })
export class StudentProfileRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'student_profiles'
  private readonly collectionName = StudentProfileRepository.collectionName

  public async getByIdAsync(id: string): Promise<StudentProfileDbModel | null> {
    const studentProfileRef = this.getRefById(id)
    const studentProfileSnapshot = await getDoc(studentProfileRef)

    if (!studentProfileSnapshot.exists()) return null

    return {
      id: studentProfileSnapshot.id,
      ...studentProfileSnapshot.data()
    } as StudentProfileDbModel
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentProfileRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentProfileRepository.collectionName}/${id}`)
  }
}
