import { Component } from '@angular/core'

import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component'

@Component({
  selector: 'gow-sign-in',
  imports: [SignInFormComponent],
  templateUrl: './sign-in.component.html'
})
export class SignInPageComponent {}
