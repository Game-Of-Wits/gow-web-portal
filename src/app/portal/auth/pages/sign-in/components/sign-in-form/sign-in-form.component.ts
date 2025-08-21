import { Component, inject, OnInit, signal } from '@angular/core'
import { getAuth, onAuthStateChanged } from '@angular/fire/auth'
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
import { AuthUserMapper } from '~/shared/mappers/auth-user.mapper'
import { UserMapper } from '~/shared/mappers/user.mapper'
import { AuthStore } from '~/shared/store/auth.store'
import { TeacherProfileService } from '~/teacher-profile/services/teacher-profile/teacher-profile.service'

const signOutErrorMessages = commonErrorMessages

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
export class SignInFormComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly teacherProfileService = inject(TeacherProfileService)

  private readonly toastService = inject(MessageService)
  private readonly authStore = inject(AuthStore)
  private readonly router = inject(Router)

  readonly isValidIcon = CircleCheckBig
  readonly isNoValidIcon = Circle

  public signInLoading = signal<boolean>(false)
  public signInForm = signInForm()

  ngOnInit(): void {
    this.initAuthListener()
  }

  public async signIn() {
    if (this.signInForm.invalid) return

    this.signInLoading.set(true)

    const signInCredentials = this.signInForm.getRawValue()

    try {
      await this.authService.signIn(
        signInCredentials.email,
        signInCredentials.password
      )
    } catch (err) {
      const error = err as ErrorResponse
      this.showSignInErrorMessage(error.code)
      this.signInLoading.set(false)
    }
  }

  private initAuthListener() {
    const auth = getAuth()

    onAuthStateChanged(auth, user => {
      if (user) {
        this.teacherProfileService
          .getTeacherProfileById(user.uid)
          .then(teacherProfile => {
            const userMapped = UserMapper.toModel(user)
            const authUser = AuthUserMapper.toModel(userMapped, teacherProfile)

            this.authStore.signIn(authUser)
            this.router.navigate(['/p/general'])
          })
          .catch(err => {
            const error = err as ErrorResponse

            if (error.code === 'teacher-profile-not-exist') {
              return this.authService
                .signOut()
                .then(() => {
                  this.signInLoading.set(false)
                })
                .catch(err => {
                  const error = err as ErrorResponse
                  this.showSignOutErrorMessage(error.code)
                })
            }

            this.showSignInErrorMessage(error.code)
            return
          })
      } else {
        this.signInLoading.set(false)
      }
    })
  }

  private showSignOutErrorMessage(code: string) {
    const { summary, message } = signOutErrorMessages[code]
    this.showErrorMessage(summary, message)
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
