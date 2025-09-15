import { HomeworkCategory } from '~/homeworks/models/HomeworkCategory.model'

export const homeworkCategoryFormats: Record<HomeworkCategory, string> = {
  [HomeworkCategory.SINGLE_CHOICE]: 'Selección unica'
}
