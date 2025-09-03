import { Injectable, inject } from '@angular/core'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'
import { MasteryRoadStudentPeriodState } from '../models/MasteryRoadStudentPeriodState'
import { ShadowWarfareStudentPeriodState } from '../models/ShadowWarfareStudentPeriodState'
import {
  MasteryRoadExperienceState,
  PendingHomework,
  ShadowWarfareExperienceState,
  StudentPeriodStateExperience,
  StudentPeriodStatesModel
} from '../models/StudentPeriodStates.model'
import {
  MasteryRoadExperienceStateDb,
  PendingHomeworkDb,
  ShadowWarfareExperienceStateDb,
  StudentPeriodStateDbExperience,
  StudentPeriodStatesDbModel
} from '../models/StudentPeriodStatesDb.model'
import { StudentService } from '../services/student/student.service'

// TODO: Los datos de las experiencias tiene que ser más dinamicos
@Injectable({ providedIn: 'root' })
export class StudentPeriodStateMapper {
  private readonly studentService = inject(StudentService)
  private readonly studentProfileService = inject(StudentProfileService)

  public toModel(
    student: StudentPeriodStatesDbModel
  ): StudentPeriodStatesModel {
    return {
      id: student.id,
      academicPeriodId: student.academicPeriod.id,
      experiences: this.studentPeriodStateExperiencesToModel(
        student.experiences
      ),
      classroomId: student.classroom.id,
      studentId: student.student.id
    }
  }

  public toListModel(
    students: StudentPeriodStatesDbModel[]
  ): StudentPeriodStatesModel[] {
    return students.map(student => this.toModel(student))
  }

  public async onlyShadowWarfareExperience(
    studentPeriodState: StudentPeriodStatesDbModel
  ): Promise<ShadowWarfareStudentPeriodState> {
    const shadowWarfareExperience = studentPeriodState.experiences[
      EducationalExperience.SHADOW_WARFARE
    ] as ShadowWarfareExperienceStateDb

    const student = await this.studentService.getStudentByIdAsync(
      studentPeriodState.student.id
    )
    const studentProfile =
      await this.studentProfileService.getStudentProfileByIdAsync(
        student.profileId
      )

    return {
      id: studentPeriodState.id,
      lastName: studentProfile.lastName,
      firstName: studentProfile.firstName,
      teamId: shadowWarfareExperience.team.id,
      characterId: shadowWarfareExperience.character.id,
      healthPoints: shadowWarfareExperience.healthPoints
    }
  }

  public async onlyShadowWarfareExperienceList(
    studentPeriodStates: StudentPeriodStatesDbModel[]
  ): Promise<ShadowWarfareStudentPeriodState[]> {
    const results = await Promise.allSettled(
      studentPeriodStates.map(state => this.onlyShadowWarfareExperience(state))
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(
        result =>
          (result as PromiseFulfilledResult<ShadowWarfareStudentPeriodState>)
            .value
      )
  }

  public async onlyMasteryRoadExperience(
    studentPeriodState: StudentPeriodStatesDbModel
  ): Promise<MasteryRoadStudentPeriodState> {
    const masteryRoadExperience = studentPeriodState.experiences[
      EducationalExperience.MASTERY_ROAD
    ] as MasteryRoadExperienceStateDb

    const student = await this.studentService.getStudentByIdAsync(
      studentPeriodState.student.id
    )
    const studentProfile =
      await this.studentProfileService.getStudentProfileByIdAsync(
        student.profileId
      )

    return {
      id: studentPeriodState.id,
      lastName: studentProfile.lastName,
      firstName: studentProfile.firstName,
      levelId: masteryRoadExperience.currentLevel.id,
      progressPoints: masteryRoadExperience.progressPoints
    }
  }

  public async onlyMasteryRoadExperienceList(
    studentPeriodStates: StudentPeriodStatesDbModel[]
  ): Promise<MasteryRoadStudentPeriodState[]> {
    const results = await Promise.allSettled(
      studentPeriodStates.map(state => this.onlyMasteryRoadExperience(state))
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(
        result =>
          (result as PromiseFulfilledResult<MasteryRoadStudentPeriodState>)
            .value
      )
  }

  private studentPeriodStateExperiencesToModel(experiences: {
    [key: string]: StudentPeriodStateDbExperience
  }): Map<EducationalExperience, StudentPeriodStateExperience> {
    const experienesMapped: Map<
      EducationalExperience,
      StudentPeriodStateExperience
    > = new Map()

    if (experiences[EducationalExperience.SHADOW_WARFARE] !== undefined) {
      const experience = experiences[
        EducationalExperience.SHADOW_WARFARE
      ] as ShadowWarfareExperienceStateDb

      const abilityIds = experience.abilities.map(ability => ability.id)
      const pendingHomeworks = this.pendingHomeworkToListModel(
        experience.pendingHomeworks
      )

      experienesMapped.set(EducationalExperience.SHADOW_WARFARE, {
        abilityIds,
        characterId: experience.character.id,
        healthPoints: experience.healthPoints,
        pendingHomeworks,
        teamId: experience.team.id
      } as ShadowWarfareExperienceState)
    }

    if (experiences[EducationalExperience.MASTERY_ROAD] !== undefined) {
      const experience = experiences[
        EducationalExperience.MASTERY_ROAD
      ] as MasteryRoadExperienceStateDb

      const abilityIds = experience.abilities.map(ability => ability.id)
      const levelRewardIds = experience.levelRewards.map(
        levelReward => levelReward.id
      )

      experienesMapped.set(EducationalExperience.MASTERY_ROAD, {
        abilityIds,
        levelRewardIds,
        currentLevelId: experience.currentLevel.id,
        progressPoints: experience.progressPoints
      } as MasteryRoadExperienceState)
    }

    return experienesMapped
  }

  private pendingHomeworkToModel(
    pendingHomework: PendingHomeworkDb
  ): PendingHomework {
    return {
      dateLimit: pendingHomework.dateLimit.toDate(),
      homeworkId: pendingHomework.homework.id
    }
  }

  private pendingHomeworkToListModel(
    pendingHomeworks: PendingHomeworkDb[]
  ): PendingHomework[] {
    return pendingHomeworks.map(this.pendingHomeworkToModel)
  }
}
