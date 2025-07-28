import { EducationalExperience } from '../models/EducationalExperience'

export const educationalExperienceFormats: Record<
  EducationalExperience,
  string
> = {
  [EducationalExperience.MASTERY_ROAD]: 'Camino de la Maestria',
  [EducationalExperience.SHADOW_WARFARE]: 'Guerra de Sombras'
}
