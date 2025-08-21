import { Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component'

@Component({
  selector: 'gow-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [RouterLink, PasswordResetFormComponent]
})
export class ForgotPasswordPageComponent {
  public sendPasswordResetSuccessfully = signal<boolean>(false)

  public setPasswordResetSuccessful() {
    this.sendPasswordResetSuccessfully.set(true)
  }
}
