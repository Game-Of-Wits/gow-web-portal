import { Routes } from '@angular/router'

import { PortalLayoutComponent } from '~/shared/layouts/portal-layout/portal-layout.component'

import { isAuthenticatedGuard } from '~/shared/guards/is-authenticated.guard'
import { isNotAuthenticatedGuard } from '~/shared/guards/is-not-authenticated.guard'

import { LandingPageComponent } from '~/shared/pages/landing/landing.component'
import { PortalGeneralPageComponent } from '~/shared/pages/portal-general/portal-general.component'

import { AuthLayoutComponent } from '~/auth/layouts/auth-layout/auth-layout.component'
import { ForgotPasswordPageComponent } from '~/auth/pages/forgot-password/forgot-password.component'
import { SignInPageComponent } from '~/auth/pages/sign-in/sign-in.component'

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [isNotAuthenticatedGuard],
    children: [
      {
        path: 'sign-in',
        component: SignInPageComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent
      }
    ]
  },
  {
    path: 'p',
    component: PortalLayoutComponent,
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'general',
        component: PortalGeneralPageComponent
      }
    ]
  }
]
