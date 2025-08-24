import { Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { Circle, CircleCheckBig, LucideAngularModule } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Ripple } from 'primeng/ripple'
import { Toast } from 'primeng/toast'
import { signInForm } from '~/auth/forms/signInForm'
import { AuthService } from '~/auth/services/auth.service'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'

const signInErrorMessages = commonErrorMessages

@Component({
  selector: 'gow-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  imports: [
    LucideAngularModule,
    ButtonModule,
    Toast,
    Ripple,
    RouterLink,
    ReactiveFormsModule,
    TextFieldComponent
  ],
  providers: [MessageService]
})
export class SignInFormComponent {
  private readonly authService = inject(AuthService)

  private readonly toastService = inject(MessageService)
  private readonly router = inject(Router)

  readonly isValidIcon = CircleCheckBig
  readonly isNoValidIcon = Circle

  public signInLoading = signal<boolean>(false)
  public signInForm = signInForm()

  public signIn() {
    if (this.signInForm.invalid) return

    this.signInLoading.set(true)

    const signInCredentials = this.signInForm.getRawValue()

    this.authService
      .signIn(signInCredentials.email, signInCredentials.password)
      .then(() => {})
      .catch(err => {
        const error = err as ErrorResponse
        this.showSignInErrorMessage(error.code)
      })
  }

  private showSignInErrorMessage(code: string) {
    const { summary, message } = signInErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, message: string) {
    this.toastService.add({
      severity: 'error',
      summary: summary,
      detail: message
    })
  }
}
