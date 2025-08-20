import { ErrorResponse } from '@shared/types/ErrorResponse'
import { CreateHomework } from '../models/CreateHomework.model'
import { HomeworkFormData } from '../models/HomeworkFormData.model'

export class HomeworkFormMapper {
  static toCreate(groupId: string, form: HomeworkFormData): CreateHomework {
    if (form.image === null) throw new ErrorResponse('homework-image-required')

    return {
      name: form.name,
      category: form.category,
      image: form.image,
      groupId,
      content: {
        options: form.content.options,
        correctOption: form.content.correctOption
      }
    }
  }
}
