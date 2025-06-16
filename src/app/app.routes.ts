import { Routes } from '@angular/router'

import { LandingPageComponent } from './shared/pages/landing/landing.component'

import { SignInPageComponent } from './core/auth/features/sign-in/sign-in.component'
import { AuthLayoutComponent } from './core/auth/ui/auth-layout/auth-layout.component'

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInPageComponent
      }
    ]
  }
]
