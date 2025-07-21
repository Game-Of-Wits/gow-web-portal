import {
  Component,
  HostListener,
  Input,
  input,
  OnInit,
  output
} from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, LucideIconData, X } from 'lucide-angular'
import { DialogModule } from 'primeng/dialog'
import { characterForm } from '~/characters/forms/characterForm'
import { CharacterForm } from '~/characters/models/CharacterForm.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { SelectOption } from '~/shared/types/SelectOption'

@Component({
  selector: 'gow-character-form-dialog',
  templateUrl: './character-form-dialog.component.html',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    TextFieldComponent,
    SelectFieldComponent,
    LucideAngularModule
  ]
})
export class CharacterFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  @Input() characterForm: FormGroup<CharacterForm> | null = null

  public characterFormPosition = input<number>(0, { alias: 'position' })
  public teamOptions = input<SelectOption[]>([], { alias: 'teams' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })
  public buttonIcon = input.required<LucideIconData>({ alias: 'buttonIcon' })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{
    position: number
    form: FormGroup<CharacterForm>
  }>({
    alias: 'success'
  })

  ngOnInit(): void {
    if (this.characterForm === null) this.characterForm = characterForm()
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  public onSubmitCharacterForm() {
    const characterForm = this.characterForm

    if (!characterForm || characterForm.invalid) return

    this.onSuccess.emit({
      position: this.characterFormPosition(),
      form: characterForm
    })
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.characterForm = characterForm()
  }

  get characterNameControl(): AbstractControl<string> | null {
    return this.characterForm?.get('name') ?? null
  }

  get characterTeamNameControl(): AbstractControl<string> | null {
    return this.characterForm?.get('teamName') ?? null
  }
}
