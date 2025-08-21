import { Component, inject, output, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
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

  public onSuccess = output<void>({ alias: 'success' })

  public passwordResetLoading = signal<boolean>(false)

  public userEmail = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  })

  public passwordReset() {
    if (this.userEmail.invalid) return

    this.passwordResetLoading.set(true)

    const email: string = this.userEmail.value

    this.authService
      .sendPasswordReset(email)
      .then(() => {
        this.passwordResetLoading.set(false)
        this.onSuccess.emit()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showSendPasswordResetErrorMessage(error.code)

        this.userEmail.reset()
        this.passwordResetLoading.set(false)
      })
  }

  private showSendPasswordResetErrorMessage(code: string) {
    const { summary, message } = passwordResetErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, message: string) {
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
