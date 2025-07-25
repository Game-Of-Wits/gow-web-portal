import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { StudentMapper } from '~/students/mappers/student.mapper'
import { StudentModel } from '~/students/models/Student.model'
import { StudentRepository } from '~/students/repositories/student.repository'

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly studentRepository = inject(StudentRepository)

  private readonly studentMapper = inject(StudentMapper)

  public async getStudentByIdAsync(studentId: string): Promise<StudentModel> {
    const student = await this.studentRepository.getByIdAsync(studentId)
    if (student === null) throw new ErrorResponse('student-not-exist')
    return this.studentMapper.toModel(student)
  }
}
