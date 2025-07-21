import { Component, Input, inject, signal } from '@angular/core'
import type { FirebaseError } from '@angular/fire/app'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Ripple } from 'primeng/ripple'
import { Toast } from 'primeng/toast'
import { AuthService } from '~/auth/services/auth.service'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'

const passwordResetErrorMessages = commonErrorMessages

@Component({
  selector: 'gow-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    Toast,
    Ripple,
    TextFieldComponent
  ],
  providers: [MessageService]
})
export class PasswordResetFormComponent {
  private authService = inject(AuthService)
  private toastService = inject(MessageService)

  @Input() setPasswordResetSuccessful?: () => void

  public passwordResetLoading = signal<boolean>(false)

  public userEmail = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  })

  public passwordReset() {
    if (this.userEmail.invalid) return

    this.passwordResetLoading.set(true)

    const email: string = this.userEmail.value

    this.authService.sendPasswordReset(email).subscribe({
      complete: () => {
        this.passwordResetLoading.set(false)
        this.setPasswordResetSuccessful?.()
      },
      error: (err: FirebaseError) => {
        this.passwordResetLoading.set(false)

        if (err.code in passwordResetErrorMessages) {
          this.showPasswordResetErrorMessage(
            passwordResetErrorMessages[err.code].summary,
            passwordResetErrorMessages[err.code].message
          )
          return
        }

        this.showPasswordResetErrorMessage(
          'Error inesperado',
          'Ha ocurrido un fallo al recuperar su contraseña, vuelva a intentarlo de nuevo.'
        )

        this.userEmail.reset()
      }
    })
  }

  public showPasswordResetErrorMessage(summary: string, message: string) {
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
