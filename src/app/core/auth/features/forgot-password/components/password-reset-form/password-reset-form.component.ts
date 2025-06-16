import { Component, Input, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

import type { FirebaseError } from '@angular/fire/app'

import { AuthService } from '../../../../services/auth/auth.service'

import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Ripple } from 'primeng/ripple'
import { Toast } from 'primeng/toast'

import { TextFieldComponent } from '../../../../../../shared/ui/components/text-field/text-field.component'

const passwordResetErrorMessages: {
  [code: string]: { summary: string; message: string }
} = {
  'auth/invalid-email': {
    summary: 'Correo electrónico invalido',
    message: 'El correo electrónico no es valido.'
  },
  'auth/missing-email': {
    summary: 'Correo electrónico requerido',
    message:
      'El correo electrónico es requerido para enviar la solicitud de recuperación de contraseña.'
  },
  'auth/too-many-requests': {
    summary: 'Muchas solicitudes',
    message:
      'Demasiados intentos de recuperación de contraseña. Intentar más tarde.'
  }
} as const

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

// 1234REWQasdf$#@!
