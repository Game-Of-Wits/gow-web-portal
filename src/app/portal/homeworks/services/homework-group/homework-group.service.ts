import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { DocumentReference, FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { HomeworkGroupMapper } from '~/homeworks/mappers/homework-group.mapper'
import { CreateHomeworkGroup } from '~/homeworks/models/CreateHomeworkGroup.model'
import { HomeworkGroupModel } from '~/homeworks/models/HomeworkGroup.model'
import { HomeworkRepository } from '~/homeworks/repositories/homework.repository'
import { HomeworkGroupRepository } from '~/homeworks/repositories/homework-group.repository'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ShadowWarfareExperienceStateDb } from '~/students/models/StudentPeriodStatesDb.model'
import { StudentRepository } from '~/students/repositories/student.repository'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'
import { TeamRepository } from '~/teams/repositories/team.repository'

@Injectable({ providedIn: 'root' })
export class HomeworkGroupService {
  private readonly homeworkRepository = inject(HomeworkRepository)
  private readonly teamRepository = inject(TeamRepository)
  private readonly homeworkGroupRepository = inject(HomeworkGroupRepository)
  private readonly classroomRepository = inject(ClassroomRepository)
  private readonly studentRepository = inject(StudentRepository)
  private readonly academicPeriodRepository = inject(AcademicPeriodRespository)
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )

  public async getAllHomeworkGroupsByClassroomAsync(classroomId: string) {
    try {
      const homeworkGroups =
        await this.homeworkGroupRepository.getAllByClassroomIdAsync(classroomId)
      const homeworkGroupsMapped =
        HomeworkGroupMapper.toListModel(homeworkGroups)

      return homeworkGroupsMapped.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async getHomeworkGroupById(
    homeworkGroupId: string
  ): Promise<HomeworkGroupModel> {
    try {
      const homeworkGroup =
        await this.homeworkGroupRepository.getByIdAsync(homeworkGroupId)
      if (homeworkGroup === null)
        throw new ErrorResponse('homework-group-not-exist')
      return HomeworkGroupMapper.toModel(homeworkGroup)
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async create(data: CreateHomeworkGroup): Promise<HomeworkGroupModel> {
    try {
      const classroomExists = await this.classroomRepository.existById(
        data.classroomId
      )

      if (!classroomExists) throw new ErrorResponse('classroom-not-exist')

      const newHomeworkGroup = await this.homeworkGroupRepository.create(data)

      return HomeworkGroupMapper.toModel(newHomeworkGroup)
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async sendHomeworksToStudents(
    schoolId: string,
    delivery: {
      homeworkGroupId: string
      baseDateLimit: Date
    }
  ): Promise<void> {
    try {
      if (delivery.baseDateLimit <= new Date())
        throw new ErrorResponse('base-date-limit-must-future')

      const homeworkGroup = await this.homeworkGroupRepository.getByIdAsync(
        delivery.homeworkGroupId
      )
      if (homeworkGroup === null)
        throw new ErrorResponse('homework-group-not-exist')

      const homeworks =
        await this.homeworkRepository.getAllByHomeworkGroupIdAsync(
          homeworkGroup.id
        )

      if (homeworks.length === 0)
        throw new ErrorResponse('homework-group-not-have-homeworks')

      const activeAcademicPeriod =
        await this.academicPeriodRepository.getSchoolActiveAcademicPeriodAsync(
          schoolId
        )
      if (activeAcademicPeriod === null)
        throw new ErrorResponse('active-academic-period-not-exist')

      const shadowWarfareStudentPeriodStates: DocumentReference[] = []

      const [students, teams] = await Promise.all([
        this.studentRepository.getAllByClassroomIdAsync(
          homeworkGroup.classroom.id
        ),
        this.teamRepository.getAllByClassroomIdAsync(homeworkGroup.classroom.id)
      ])

      if (students.length < teams.length)
        throw new ErrorResponse('students-per-team-failed')

      const classroom = await this.classroomRepository.getById(
        homeworkGroup.classroom.id
      )

      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      students.forEach(student => {
        shadowWarfareStudentPeriodStates.push(
          student.experiences[EducationalExperience.SHADOW_WARFARE]
        )
      })

      const studentPeriodStates =
        await this.studentPeriodStateRepository.getAllByRefsAndAcademicPeriod(
          activeAcademicPeriod.id,
          shadowWarfareStudentPeriodStates
        )

      studentPeriodStates.forEach(studentPeriodState => {
        const studentExperience = studentPeriodState.experiences[
          EducationalExperience.SHADOW_WARFARE
        ] as ShadowWarfareExperienceStateDb

        if (
          studentExperience.homeworks.length >
          classroom.experiences.SHADOW_WARFARE.limitAbilities
        )
          throw new ErrorResponse('limit-abilities-exceeded')
      })

      await this.homeworkGroupRepository.saveRandomHomeworksToStudents(
        {
          homeworkGroupId: homeworkGroup.id,
          baseDateLimit: delivery.baseDateLimit
        },
        {
          studentPeriodStates,
          homeworks
        }
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
