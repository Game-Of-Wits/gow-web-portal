import { doc, Firestore } from '@angular/fire/firestore'

export class TeacherRepository {
  private static readonly collectionName = 'teacher_profiles'
  private readonly collectionName = TeacherRepository.collectionName

  public static getTeacherRefById(db: Firestore, id: string) {
    return doc(db, `${TeacherRepository.collectionName}/${id}`)
  }
}
