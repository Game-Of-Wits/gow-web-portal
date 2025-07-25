import { Routes } from '@angular/router'
import { AuthLayoutComponent } from '~/auth/layouts/auth-layout/auth-layout.component'
import { ForgotPasswordPageComponent } from '~/auth/pages/forgot-password/forgot-password.component'
import { SignInPageComponent } from '~/auth/pages/sign-in/sign-in.component'
import { ClassroomAdminPanelLayoutComponent } from '~/classrooms/layouts/classroom-admin-panel-layout/classroom-admin-panel-layout.component'
import { ClassroomAdminPanelAbiltiesPageComponent } from '~/classrooms/pages/classroom-admin-panel-abilities/classroom-admin-panel-abilities.component'
import { ClassroomAdminPanelHomeworksPageComponent } from '~/classrooms/pages/classroom-admin-panel-homeworks/classroom-admin-panel-homeworks.component'
import { ClassroomAdminPanelLevelsPageComponent } from '~/classrooms/pages/classroom-admin-panel-levels/classroom-admin-panel-levels.component'
import { ClassroomAdminPanelOverviewPageComponent } from '~/classrooms/pages/classroom-admin-panel-overview/classroom-admin-panel-overview.component'
import { ClassroomAdminPanelTeamsCharactersPageComponent } from '~/classrooms/pages/classroom-admin-panel-teams-characters/classroom-admin-panel-teams-characters.component'
import { PortalCreateClassroomPageComponent } from '~/classrooms/pages/portal-create-classroom/portal-create-classroom.component'
import { ClassroomAdminPanelPenaltiesPageComponent } from '~/penalties/pages/classroom-admin-panel-penalties/classroom-admin-panel-penalties.component'
import { getDefaultSchoolGuard } from '~/shared/guards/default-school.guard'
import { isAuthenticatedGuard } from '~/shared/guards/is-authenticated.guard'
import { isNotAuthenticatedGuard } from '~/shared/guards/is-not-authenticated.guard'
import { PortalLayoutComponent } from '~/shared/layouts/portal-layout/portal-layout.component'
import { LandingPageComponent } from '~/shared/pages/landing/landing.component'
import { PortalGeneralPageComponent } from '~/shared/pages/portal-general/portal-general.component'
import { ClassroomAdminPanelStudentDetailsPageComponent } from '~/students/pages/classroom-admin-panel-student-details/classroom-admin-panel-student-details.component'
import { ClassroomAdminPanelStudentsPageComponent } from '~/students/pages/classroom-admin-panel-students/classroom-admin-panel-students.component'

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
    canActivate: [isAuthenticatedGuard, getDefaultSchoolGuard],
    children: [
      {
        path: 'general',
        component: PortalGeneralPageComponent
      },
      {
        path: 's/:schoolId',
        children: [
          {
            path: 'classroom/create',
            component: PortalCreateClassroomPageComponent
          },
          {
            path: 'c/:classroomId',
            component: ClassroomAdminPanelLayoutComponent,
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
              },
              {
                path: 'overview',
                component: ClassroomAdminPanelOverviewPageComponent
              },
              {
                path: 'students',
                component: ClassroomAdminPanelStudentsPageComponent
              },
              {
                path: 'students/:studentId',
                component: ClassroomAdminPanelStudentDetailsPageComponent
              },
              {
                path: 'teams',
                component: ClassroomAdminPanelTeamsCharactersPageComponent
              },
              {
                path: 'homeworks',
                component: ClassroomAdminPanelHomeworksPageComponent
              },
              {
                path: 'levels',
                component: ClassroomAdminPanelLevelsPageComponent
              },
              {
                path: 'abilities',
                component: ClassroomAdminPanelAbiltiesPageComponent
              },
              {
                path: 'penalties',
                component: ClassroomAdminPanelPenaltiesPageComponent
              }
            ]
          }
        ]
      }
    ]
  }
]
