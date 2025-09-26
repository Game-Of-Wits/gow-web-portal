import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  DocumentSnapshot,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch
} from '@angular/fire/firestore'
import { CharacterRepository } from '~/characters/repositories/character.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import {
  ShadowWarfareExperienceStateDb,
  StudentPeriodStatesDbModel
} from '~/students/models/StudentPeriodStatesDb.model'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'
import { CreateHomeworkGroup } from '../models/CreateHomeworkGroup.model'
import { HomeworkDbModel } from '../models/HomeworkDb.model'
import { HomeworkGroupDbModel } from '../models/HomeworkGroupDb.model'
import { StudentHomeworkStatus } from '../models/StudentHomework.model'
import { HomeworkRepository } from './homework.repository'
import { StudentHomeworkRepository } from './student-homework.repository'

@Injectable({ providedIn: 'root' })
export class HomeworkGroupRepository {
  private readonly firestore = inject(Firestore)

  private readonly studentHomeworkRepository = inject(StudentHomeworkRepository)
  private readonly characterRepository = inject(CharacterRepository)

  private static readonly collectionName = 'homework_groups'
  private readonly collectionName = HomeworkGroupRepository.collectionName

  public async getAllByClassroomIdAsync(
    classroomId: string
  ): Promise<HomeworkGroupDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const homeworkGroupsQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    const homeworkGroupsSnapshot = await getDocs(homeworkGroupsQuery)

    return homeworkGroupsSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data()
        }) as HomeworkGroupDbModel
    )
  }

  public async getByIdAsync(id: string): Promise<HomeworkGroupDbModel | null> {
    const homeworkGroupRef = this.getRefById(id)
    const homeworkGroupSnapshot = await getDoc(homeworkGroupRef)

    if (!homeworkGroupSnapshot.exists()) return null

    return {
      id: homeworkGroupSnapshot.id,
      ...homeworkGroupSnapshot.data()
    } as HomeworkGroupDbModel
  }

  public async existByIdAsync(id: string): Promise<boolean> {
    const homeworkGroupRef = this.getRefById(id)
    const homeworkGroupSnapshot = await getDoc(homeworkGroupRef)
    return homeworkGroupSnapshot.exists()
  }

  public async create(
    data: CreateHomeworkGroup
  ): Promise<HomeworkGroupDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newHomeworkGroupRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      homeworks: [],
      classroom: classroomRef,
      createdAt: serverTimestamp(),
      baseDateLimit: null,
      deliveredAt: null
    })) as DocumentReference<HomeworkGroupDbModel>

    const newHomeworkGroupSnapshot: DocumentSnapshot<HomeworkGroupDbModel> =
      await getDoc(newHomeworkGroupRef)

    return {
      id: newHomeworkGroupSnapshot.id,
      ...newHomeworkGroupSnapshot.data()
    } as HomeworkGroupDbModel
  }

  public async saveRandomHomeworksToStudents(
    deliveryHomeworkGroup: {
      homeworkGroupId: string
      baseDateLimit: Date
    },
    distribution: {
      studentPeriodStates: StudentPeriodStatesDbModel[]
      homeworks: HomeworkDbModel[]
    }
  ) {
    const homeworkGroupRef = this.getRefById(
      deliveryHomeworkGroup.homeworkGroupId
    )

    const shuffledStudents = [...distribution.studentPeriodStates].sort(
      () => Math.random() - 0.5
    )

    const assignments: {
      studentPeriodState: StudentPeriodStatesDbModel
      homework: DocumentReference
    }[] = []

    const baseCount = Math.floor(
      shuffledStudents.length / distribution.homeworks.length
    )
    const remainder = shuffledStudents.length % distribution.homeworks.length

    let index = 0
    distribution.homeworks.forEach((homework, i) => {
      const count = baseCount + (i < remainder ? 1 : 0)
      for (let j = 0; j < count; j++) {
        assignments.push({
          studentPeriodState: shuffledStudents[index++],
          homework: HomeworkRepository.getRefById(this.firestore, homework.id)
        })
      }
    })

    const batch = writeBatch(this.firestore)

    const baseDateLimit = Timestamp.fromDate(
      deliveryHomeworkGroup.baseDateLimit
    )

    const deliveredAt = serverTimestamp()

    for (const { studentPeriodState, homework } of assignments) {
      const studentPeriodStateRef = StudentPeriodStateRepository.getRefById(
        this.firestore,
        studentPeriodState.id
      )

      const studentExperience = studentPeriodState.experiences[
        EducationalExperience.SHADOW_WARFARE
      ] as ShadowWarfareExperienceStateDb

      const newStudentHomeworkRef = StudentHomeworkRepository.generateRef(
        this.firestore
      )

      const studentHomeworksCount =
        await this.studentHomeworkRepository.countByStudentPeriodStateIdAsync(
          studentPeriodStateRef.id
        )

      const character = await this.characterRepository.getByIdAsync(
        studentExperience.character.id
      )

      const rewardAbility = character?.abilities[studentHomeworksCount] ?? null

      batch.set(newStudentHomeworkRef, {
        studentState: studentPeriodStateRef,
        homework: homework,
        deadline: baseDateLimit,
        deliveredAt: deliveredAt,
        rewardAbility: rewardAbility,
        answer: null,
        status: StudentHomeworkStatus.PENDING
      })

      batch.update(studentPeriodStateRef, {
        experiences: {
          ...studentPeriodState.experiences,
          SHADOW_WARFARE: {
            ...studentExperience,
            homeworks: [
              ...(studentExperience.homeworks ?? []),
              newStudentHomeworkRef
            ]
          }
        }
      })
    }

    batch.update(homeworkGroupRef, {
      baseDateLimit: baseDateLimit,
      deliveredAt: deliveredAt
    })

    await batch.commit()
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, HomeworkGroupRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${HomeworkGroupRepository.collectionName}/${id}`)
  }
}
