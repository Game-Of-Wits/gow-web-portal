import { Component } from '@angular/core'
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component'

@Component({
  selector: 'gow-sign-in',
  imports: [SignInFormComponent],
  template: `
    <h2 class="text-3xl font-bold text-primary mb-4">Ingresa a tu cuenta de GoW</h2>
    <gow-sign-in-form></gow-sign-in-form>
  `
})
export class SignInPageComponent {}
