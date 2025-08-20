import { HomeworkCategory } from '~/homeworks/models/HomeworkCategory.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { homeworkCategoryFormats } from '../formats/homeworkCategoryFormats'

export const homeworkCategoryOptions: SelectOption[] = Object.entries(
  homeworkCategoryFormats
).map(([key, value]) => {
  return {
    name: value,
    code: key as HomeworkCategory
  }
})
