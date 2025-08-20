import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  where,
  writeBatch
} from '@angular/fire/firestore'
import { AnswerOptionDb } from '../models/AnswerOptionDb.model'
import { CreateAnswerOption } from '../models/CreateAnswerOption.model'
import { HomeworkRepository } from './homework.repository'

@Injectable({ providedIn: 'root' })
export class AnswerOptionRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'answer_options'
  private readonly collectionName = AnswerOptionRepository.collectionName

  public async getAllByHomeworkIdAsync(
    homeworkId: string
  ): Promise<AnswerOptionDb[]> {
    const homeworkRef = HomeworkRepository.getRefById(
      this.firestore,
      homeworkId
    )

    const answerOptionsQuery = query(
      this.getCollectionRef(),
      where('homework', '==', homeworkRef)
    )
    const answerOptionsSnapshot = await getDocs(answerOptionsQuery)

    return answerOptionsSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as AnswerOptionDb
    )
  }

  public async createAll(
    homeworkId: string,
    options: CreateAnswerOption[]
  ): Promise<AnswerOptionDb[]> {
    const homeworkRef = HomeworkRepository.getRefById(
      this.firestore,
      homeworkId
    )

    const batch = writeBatch(this.firestore)
    const created: AnswerOptionDb[] = []

    for (const answerOption of options) {
      const answerOptionRef = this.generateRef()

      batch.set(answerOptionRef, {
        answer: answerOption.answer,
        homework: homeworkRef
      })

      created.push({
        id: answerOptionRef.id,
        answer: answerOption.answer,
        homework: homeworkRef
      })
    }

    await batch.commit()

    return created
  }

  public async deleteAllByHomeworkId(homeworkId: string): Promise<void> {
    const homeworkRef = HomeworkRepository.getRefById(
      this.firestore,
      homeworkId
    )

    const answerOptionsQuery = query(
      this.getCollectionRef(),
      where('homework', '==', homeworkRef)
    )

    const answerOptionsSnapshot = await getDocs(answerOptionsQuery)

    if (answerOptionsSnapshot.empty) return

    const deleteAllBatch = writeBatch(this.firestore)

    answerOptionsSnapshot.forEach(answerOption => {
      deleteAllBatch.delete(answerOption.ref)
    })

    await deleteAllBatch.commit()
  }

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
    return collection(db, AnswerOptionRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${AnswerOptionRepository.collectionName}/${id}`)
  }
}
