export interface AbilityUseModel {
  student: {
    firstName: string
    lastName: string
  }
  abilityName: string
  characterId: string | null
  createdAt: Date
}
