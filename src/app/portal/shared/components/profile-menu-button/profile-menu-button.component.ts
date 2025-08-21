import { NgOptimizedImage } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { LucideAngularModule, User } from 'lucide-angular'
import { type MenuItem, MessageService } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { Toast } from 'primeng/toast'
import { AuthService } from '~/auth/services/auth.service'
import { AuthStore } from '~/shared/store/auth.store'

@Component({
  selector: 'gow-profile-menu-button',
  templateUrl: './profile-menu-button.component.html',
  imports: [NgOptimizedImage, Menu, Toast, LucideAngularModule],
  providers: [MessageService]
})
export class ProfileMenuButtonComponent {
  private readonly authService = inject(AuthService)
  private readonly toastService = inject(MessageService)
  private readonly router = inject(Router)

  readonly authStore = inject(AuthStore)

  readonly defaultAvatar = User

  readonly profileMenuOptions: MenuItem[] = [
    {
      separator: true
    },
    {
      label: 'Cerrar sesión',
      command: async () => {
        this.showSignOutLoading()

        this.authService
          .signOut()
          .then(() => {
            this.authStore.logOut()
            this.router.navigate(['/'])
          })
          .catch(() => {
            this.showSignOutError()
          })
      }
    }
  ]

  private showSignOutLoading() {
    this.toastService.add({
      severity: 'info',
      summary: 'Cierre de sesión en curso',
      detail: 'Se esta cerrando la sesión de su usuario. Espere unos segundos'
    })
  }

  private showSignOutError() {
    this.toastService.add({
      severity: 'error',
      summary: 'Cierre de sesión cancelado',
      detail:
        'Ha ocurrido un fallo inesperado en el cierre de sesión. Vuelva a intentarlo.'
    })
  }
}
