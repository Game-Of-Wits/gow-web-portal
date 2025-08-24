import { Injectable, inject } from '@angular/core'
import { Functions } from '@angular/fire/functions'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { httpsCallable } from 'firebase/functions'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentMapper } from '~/students/mappers/student.mapper'
import { CreateStudent } from '~/students/models/CreateStudent.model'
import { StudentModel } from '~/students/models/Student.model'
import { StudentRepository } from '~/students/repositories/student.repository'

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly studentRepository = inject(StudentRepository)

  private readonly studentMapper = inject(StudentMapper)

  private readonly cloudFunctions = inject(Functions)

  public async getStudentByIdAsync(studentId: string): Promise<StudentModel> {
    const student = await this.studentRepository.getByIdAsync(studentId)
    if (student === null) throw new ErrorResponse('student-not-exist')
    return this.studentMapper.toModel(student)
  }

  public async createStudent(
    classroomId: string,
    data: CreateStudent
  ): Promise<StudentProfileModel> {
    try {
      const createClassroomFn = httpsCallable(
        this.cloudFunctions,
        'createStudent'
      )

      const result = await createClassroomFn({ classroomId, student: data })

      return result.data as StudentProfileModel
    } catch (err) {
      const error = err as { code: string; message: string }
      throw { code: error.code, message: error.message }
    }
  }
}
