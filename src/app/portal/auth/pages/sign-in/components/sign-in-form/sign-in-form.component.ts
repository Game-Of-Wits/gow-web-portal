import { Component, inject, signal } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'

import { tap } from 'rxjs'

import type { FirebaseError } from '@angular/fire/app'

import { AuthService } from '~/auth/services/auth.service'
import { UserService } from '~/shared/services/user.service'

import { AuthStore } from '~/shared/store/auth.store'

import { AuthUserMapper } from '~/shared/mappers/auth-user.mapper'
import { UserMapper } from '~/shared/mappers/user.mapper'

import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Ripple } from 'primeng/ripple'
import { Toast } from 'primeng/toast'

import { Circle, CircleCheckBig, LucideAngularModule } from 'lucide-angular'

import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { PasswordValidators } from '~/shared/components/ui/text-field/validators/PasswordValidators'

interface SignInForm {
  email: FormControl<string>
  password: FormControl<string>
}

const signInErrorMessages: {
  [code: string]: { summary: string; message: string }
} = {
  'auth/invalid-email': {
    summary: 'Correo erroneo',
    message: 'El correo ingresado no es válido.'
  },
  'auth/user-disabled': {
    summary: 'Usuario deshabilitado',
    message: 'La cuenta ha sido deshabilitada.'
  },
  'auth/too-many-requests': {
    summary: 'Muchas solicitudes',
    message: 'Demaciados intentos de inicio de sesión. Intentelo más tarde.'
  },
  'auth/permission-denied': {
    summary: 'Acceso no autorizado',
    message: 'Solo se permite el acceso a cuentas que sean de profesores.'
  }
} as const

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
  private readonly userService = inject(UserService)
  private readonly toastService = inject(MessageService)
  private readonly authStore = inject(AuthStore)
  private readonly router = inject(Router)

  readonly isValidIcon = CircleCheckBig
  readonly isNoValidIcon = Circle

  public signInLoading = signal<boolean>(false)
  public signInCredentials = new FormGroup<SignInForm>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(12),
        PasswordValidators.hasLowercase(),
        PasswordValidators.hasCapitalLetter(),
        PasswordValidators.hasSpecialSymbols(),
        PasswordValidators.hasNumber()
      ]
    })
  })

  public signIn() {
    if (this.signInCredentials.invalid) return

    this.signInLoading.set(true)

    const email = this.signInCredentials.get('email')!.value.trim()
    const password = this.signInCredentials.get('password')!.value.trim()

    this.authService
      .signIn(email, password)
      .pipe(
        tap(async cred => {
          const profile = await this.userService.getTeacherProfile(
            cred.user.uid
          )

          if (!profile) {
            this.authService.signOut().subscribe()
            throw new Error('auth/permission-denied')
          }

          const user = UserMapper.toModel(cred.user)
          const authUser = AuthUserMapper.toModel(user, profile)

          this.authStore.signIn(authUser)
        })
      )
      .subscribe({
        complete: async () => {
          this.router.navigate(['/p/general'])
        },
        error: (err: FirebaseError) => {
          this.signInLoading.set(false)
          this.signInCredentials.reset({ email: '', password: '' })

          if (err.code in signInErrorMessages) {
            this.showSignInErrorToast(
              signInErrorMessages[err.code].summary,
              signInErrorMessages[err.code].message
            )

            return
          }

          this.showSignInErrorToast(
            'Error inesperado',
            'Ha ocurrido un fallo al iniciar sesión, vuelva a intentarlo de nuevo'
          )
        }
      })
  }

  /*
  public invalidPasswordValidation(validationKey: string) {
    return (
      this.signInCredentials.pristine ||
      this.signInCredentials.get('password')?.value === '' ||
      this.signInCredentials.get('password')?.hasError(validationKey)
    )
  }
  */

  public showSignInErrorToast(summary: string, message: string) {
    this.toastService.add({
      severity: 'error',
      summary: summary,
      detail: message
    })
  }
}
