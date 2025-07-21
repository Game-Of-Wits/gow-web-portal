import { Component, inject, OnInit, signal } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { ColorPickerModule } from 'primeng/colorpicker'
import { TooltipModule } from 'primeng/tooltip'
import { InitialExperienceAbilityListFormComponent } from '~/abilities/components/initial-experience-ability-list-form/initial-experience-ability-list-form.component'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { InitialCharacterListFormComponent } from '~/characters/components/initial-character-list-form/initial-character-list-form.component'
import { CharacterForm } from '~/characters/models/CharacterForm.model'
import { classroomForm } from '~/classrooms/forms/classroomForm'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { ClassroomLevelListFormComponent } from '~/levels/components/classroom-level-list-form/classroom-level-list-form.component'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { PenaltyListFormComponent } from '~/penalties/components/penalty-list-form/penalty-list-form.component'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { educationLevelFormats } from '~/shared/data/educationLevelFormats'
import { gradeYearFormats } from '~/shared/data/gradeYearFormats'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AuthStore } from '~/shared/store/auth.store'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { SelectOption } from '~/shared/types/SelectOption'

@Component({
  selector: 'gow-portal-create-classroom',
  templateUrl: './portal-create-classroom.component.html',
  imports: [
    PageHeaderComponent,
    TextFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    InitialCharacterListFormComponent,
    InitialExperienceAbilityListFormComponent,
    ClassroomLevelListFormComponent,
    PenaltyListFormComponent,
    ReactiveFormsModule,
    TooltipModule,
    ColorPickerModule,
    LucideAngularModule
  ]
})
export class PortalCreateClassroomPageComponent implements OnInit {
  private readonly classroomService = inject(ClassroomsService)
  private readonly defaultSchoolStore = inject(DefaultSchoolStore)
  private readonly authStore = inject(AuthStore)
  private readonly fb = inject(FormBuilder)

  public readonly shadowWarfareExperience = EducationalExperience.SHADOW_WARFARE
  public readonly masteryRoadExperience = EducationalExperience.MASTERY_ROAD
  public readonly abilityUsage = AbilityUsage.INTERVAL_TIME
  public readonly addClassroomIcon = Plus
  public readonly shadowWarfareTeamsFormGroupPath =
    'experiences.SHADOW_WARFARE.teams'

  public classroomForm = classroomForm(this.fb)

  public schoolGradeYearOptions = signal<SelectOption[]>([])
  public teamNameOptions = signal<SelectOption[]>([])

  ngOnInit(): void {
    this.onLoadSchoolGradeYears()

    const shadowWarfareTeamsFormGroup = this.shadowWarfareTeamsFormGroup

    if (shadowWarfareTeamsFormGroup) {
      shadowWarfareTeamsFormGroup.valueChanges.subscribe(() => {
        this.updateTeamOptions()
      })
    }

    this.updateTeamOptions()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  public updateTeamOptions() {
    const invalidFirstTeamName = this.firstTeamNameControl?.invalid
    const invalidSecondTeamName = this.secondTeamNameControl?.invalid
    const invalidTeamsFormGroup = this.shadowWarfareTeamsFormGroup?.invalid

    if (
      invalidFirstTeamName ||
      invalidSecondTeamName ||
      invalidTeamsFormGroup
    ) {
      this.teamNameOptions.set([])
      return
    }

    const firstTeamName = this.firstTeamNameControl!.value
    const secondTeamName = this.secondTeamNameControl!.value

    this.teamNameOptions.set([
      { name: firstTeamName, code: firstTeamName },
      { name: secondTeamName, code: secondTeamName }
    ])
  }

  public onCreateClassroom() {
    if (this.classroomForm.invalid) return

    const schoolId = this.defaultSchoolStore.school()?.id ?? null
    const teacherId = this.authStore.authUser()?.id ?? null

    if (schoolId === null || teacherId === null) return

    this.classroomService.createClassroom({
      ...this.classroomForm.getRawValue(),
      schoolId: schoolId,
      teacherId: teacherId
    })
  }

  private onLoadSchoolGradeYears() {
    const gradeYears = this.defaultSchoolStore.gradeYears()

    if (gradeYears !== null)
      this.schoolGradeYearOptions.set(
        gradeYears.map(gradeYear => ({
          name: `${educationLevelFormats[gradeYear.educationLevel]} - ${
            gradeYearFormats[gradeYear.gradeYear]
          } ${gradeYear.section}`,
          code: gradeYear.id
        }))
      )
  }

  get classroomNameControl(): AbstractControl<string> | null {
    return this.classroomForm.get('name')
  }

  get classroomGradeYearControl(): AbstractControl<string> | null {
    return this.classroomForm.get('gradeYearId')
  }

  get firstTeamNameControl(): AbstractControl<string> | null {
    return this.classroomForm.get(
      `${this.shadowWarfareTeamsFormGroupPath}.firstTeamName`
    )
  }

  get secondTeamNameControl(): AbstractControl<string> | null {
    return this.classroomForm.get(
      `${this.shadowWarfareTeamsFormGroupPath}.secondTeamName`
    )
  }

  get healthPointBaseControl(): AbstractControl<number> | null {
    return this.classroomForm.get(
      'experiences.SHADOW_WARFARE.character.healthPointBase'
    )
  }

  get limitAbilitiesControl(): AbstractControl<number> | null {
    return this.classroomForm.get(
      'experiences.SHADOW_WARFARE.character.limitAbilities'
    )
  }

  get initialLevelNameControl(): AbstractControl<string> | null {
    return this.classroomForm.get(
      'experiences.MASTERY_ROAD.levels.initialLevel.name'
    )
  }

  get initialLevelPrimaryColorControl(): AbstractControl<string> | null {
    return this.classroomForm.get(
      'experiences.MASTERY_ROAD.levels.initialLevel.primaryColor'
    )
  }

  get shadowWarfareTeamsFormGroup(): AbstractControl | null {
    return this.classroomForm.get(this.shadowWarfareTeamsFormGroupPath)
  }

  get initialCharactersFormArray(): FormArray<FormGroup<CharacterForm>> {
    return this.classroomForm.get(
      'experiences.SHADOW_WARFARE.initialCharacters'
    ) as FormArray
  }

  get initialAbilitiesFormArray(): FormArray<FormGroup<AbilityForm>> {
    return this.classroomForm.get(
      'experiences.SHADOW_WARFARE.initialAbilities'
    ) as FormArray
  }

  get levelsFormArray(): FormArray<FormGroup<LevelForm>> {
    return this.classroomForm.get(
      'experiences.MASTERY_ROAD.levels.list'
    ) as FormArray<FormGroup<LevelForm>>
  }

  get initialLevelFormGroup(): AbstractControl | null {
    return this.classroomForm.get(
      'experiences.MASTERY_ROAD.levels.initialLevel'
    )
  }

  get masteryRoadLevelsFormGroup(): AbstractControl | null {
    return this.classroomForm.get('experiences.MASTERY_ROAD.levels')
  }

  get penaltiesFormArray(): FormArray<FormGroup<PenaltyForm>> {
    return this.classroomForm.get(
      'experiences.MASTERY_ROAD.penalties'
    ) as FormArray<FormGroup<PenaltyForm>>
  }

  get shadowWarfareExperienceFormGroup(): AbstractControl | null {
    return this.classroomForm.get('experiences.SHADOW_WARFARE')
  }
}
